package com.notifydesktop;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.telephony.TelephonyManager;

public class CallState extends BroadcastReceiver{

  private class BackgroundHttpRequest extends AsyncTask<String, Void, String> {
    @Override
    protected String doInBackground(String... urls) {
      for (String url : urls) {
        HttpClient httpclient = new DefaultHttpClient();
        HttpResponse response;
        try{
          response = httpclient.execute(new HttpGet(url));
          response.getEntity().getContent().close();
        }catch (ClientProtocolException e){
          //e.printStackTrace();
        }catch (IOException e){
          //e.printStackTrace();
        }
      }
      return "";
    }
  }

  @Override
  public void onReceive(Context context, Intent intent){
    if(TelephonyManager.EXTRA_STATE_RINGING.equals(intent.getStringExtra(TelephonyManager.EXTRA_STATE))){
      SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
      String passphrase = prefs.getString("passphrase", "");
      String server = prefs.getString("server", "http://noti.jit.su/");
      if(passphrase.length() > 0){
        String incomingNumberStr = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
        
        BackgroundHttpRequest task = new BackgroundHttpRequest();
        task.execute(new String[] { server+"message/"+passphrase+"/"+incomingNumberStr });
      }
    }
  }
}
