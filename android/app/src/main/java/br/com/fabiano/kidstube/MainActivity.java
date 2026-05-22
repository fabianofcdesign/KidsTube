package br.com.fabiano.kidstube;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ShortsBlockerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
