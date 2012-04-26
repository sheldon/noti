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
import android.preference.PreferenceManager;
import android.telephony.TelephonyManager;

public class CallState extends BroadcastReceiver{
  @Override
  public void onReceive(Context context, Intent intent){
    if(TelephonyManager.EXTRA_STATE_RINGING.equals(intent.getStringExtra(TelephonyManager.EXTRA_STATE))){
      SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
      String passphrase = prefs.getString("passphrase", "");
      String server = prefs.getString("server", "http://noti.tmp.sh/");
      if(passphrase.length() > 0){
	      String incomingNumberStr = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
	      
	      HttpClient httpclient = new DefaultHttpClient();
	      HttpResponse response;
	      try{
	        response = httpclient.execute(new HttpGet(server+"message/"+passphrase+"/"+incomingNumberStr));
	        response.getEntity().getContent().close();
	      }catch (ClientProtocolException e){
	        //e.printStackTrace();
	      }catch (IOException e){
	        //e.printStackTrace();
	      }
      }
    }
  }
}
