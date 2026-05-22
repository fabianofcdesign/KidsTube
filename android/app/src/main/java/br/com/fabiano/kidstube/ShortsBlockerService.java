package br.com.fabiano.kidstube;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Toast;

public class ShortsBlockerService extends AccessibilityService {

    private static final String YOUTUBE_PACKAGE = "com.google.android.youtube";
    private static final String SETTINGS_PACKAGE = "com.android.settings";
    
    private SharedPreferences prefs;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        prefs = getSharedPreferences("ShortsBlockerPrefs", Context.MODE_PRIVATE);
        
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED | AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED;
        info.packageNames = new String[]{YOUTUBE_PACKAGE, SETTINGS_PACKAGE};
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS | AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS;
        
        setServiceInfo(info);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event == null || event.getPackageName() == null) return;
        
        String packageName = event.getPackageName().toString();
        
        if (packageName.equals(YOUTUBE_PACKAGE)) {
            handleYouTubeEvent(event);
        } else if (packageName.equals(SETTINGS_PACKAGE)) {
            handleSettingsEvent(event);
        }
    }

    private void handleYouTubeEvent(AccessibilityEvent event) {
        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode == null) return;

        // Procura por Views que contenham a descrição "Shorts"
        boolean foundShorts = searchForShorts(rootNode);
        if (foundShorts) {
            // Força o fechamento do Shorts
            performGlobalAction(GLOBAL_ACTION_BACK);
            Toast.makeText(this, "Shorts Bloqueados pelo Controle Parental", Toast.LENGTH_SHORT).show();
        }
        rootNode.recycle();
    }

    private boolean searchForShorts(AccessibilityNodeInfo node) {
        if (node == null) return false;
        
        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null) {
            String desc = contentDesc.toString().toLowerCase();
            // Verifica se está assistindo um Short (Geralmente a view de player tem a descrição "Shorts player")
            if (desc.contains("shorts player") || desc.contains("vídeo curto")) {
                return true;
            }
        }
        
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (searchForShorts(child)) {
                return true;
            }
            if (child != null) {
                child.recycle();
            }
        }
        
        return false;
    }

    private void handleSettingsEvent(AccessibilityEvent event) {
        // Se o usuário tentar abrir a tela de desinstalar o app ou remover as permissões
        // Nós fechamos a tela caso a "Senha" não tenha sido inserida ou destravada temporariamente
        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode == null) return;
        
        CharSequence className = event.getClassName();
        if (className != null && className.toString().contains("DeviceAdminAdd")) {
            // Tentando desativar o Device Admin
            // Idealmente abriríamos uma Activity pedindo a senha aqui, 
            // mas por segurança e simplicidade, forçamos o BACK se não estiver "Destravado"
            boolean isUnlocked = prefs.getBoolean("IS_UNLOCKED_TEMP", false);
            if (!isUnlocked) {
                performGlobalAction(GLOBAL_ACTION_HOME);
                Toast.makeText(this, "Acesso negado. Use o app KidsTube para desbloquear com a senha.", Toast.LENGTH_LONG).show();
            }
        }
        
        // Pode-se adicionar detecção para a tela de App Info (Desinstalar) aqui também.
        
        rootNode.recycle();
    }

    @Override
    public void onInterrupt() {
        // Serviço interrompido
    }
}
