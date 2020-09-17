package com.forestwatcher;

import android.content.Context;
import android.os.Build;
import android.os.LocaleList;
import cl.json.ShareApplication;
import com.cube.rnmbtiles.ReactNativeMBTilesPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.modules.core.PermissionListener;
import com.facebook.soloader.SoLoader;
import com.forestwatcher.intents.IntentsPackage;
import com.forestwatcher.mapbox.FWMapboxPackage;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication implements ShareApplication, OnImagePickerPermissionsCallback
{
	private final ReactNativeHost mReactNativeHost = new NavigationReactNativeHost(this)
	{
		@Override
		public boolean getUseDeveloperSupport()
		{
			return BuildConfig.DEBUG;
		}

		@Override
		protected List<ReactPackage> getPackages()
		{
			@SuppressWarnings("UnnecessaryLocalVariable")
			List<ReactPackage> packages = new PackageList(this).getPackages();
			// Packages that cannot be autolinked yet can be added manually here, for
			// example:
			packages.addAll(Arrays.<ReactPackage>asList(
				new BackgroundGeolocationPackage(),
				new SafeAreaContextPackage(),
				new FWMapboxPackage(),
				new IntentsPackage(),
				new ReactNativeMBTilesPackage()
			));
			return packages;
		}

		@Override
		protected String getJSMainModuleName()
		{
			return "index";
		}
	};

	private PermissionListener listener;

	@Override
	public ReactNativeHost getReactNativeHost()
	{
		return mReactNativeHost;
	}

	@Override
	public void onCreate()
	{
		super.onCreate();
		SoLoader.init(this, /* native exopackage */ false);
		initializeFlipper(this); // Remove this line if you don't want Flipper enabled

		/*
		 * This code fixes GFW-791 where the Malagasy language would not display if configured alongside other languages
		 * in a priority list.
		 *
		 * For instance, if the app settings were set with the following list: 1) Malagasy, 2) English
		 * ....then LocaleList.getAdjustedDefault() would return 1) English, 2) Malagasy
		 * ....but LocaleList.getDefault() would return the correct order.
		 * However, it is LocaleList.getAdjustedDefault that appears to be what is used!
		 *
		 * To fix this, we instead explicitly set the app locale to LocaleList.getDefault on startup
		 */
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N)
		{
			getResources().getConfiguration().setLocales(LocaleList.getDefault());
		}
	}

	/**
	 * Loads Flipper in React Native templates.
	 *
	 * @param context
	 */
	private static void initializeFlipper(Context context)
	{
		if (BuildConfig.DEBUG)
		{
			try
			{
				/*
				 * We use reflection here to pick up the class that initializes Flipper, since
				 * Flipper library is not available in release mode
				 */
				Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
				aClass.getMethod("initializeFlipper", Context.class)
				      .invoke(null, context);
			}
			catch (ClassNotFoundException e)
			{
				e.printStackTrace();
			}
			catch (NoSuchMethodException e)
			{
				e.printStackTrace();
			}
			catch (IllegalAccessException e)
			{
				e.printStackTrace();
			}
			catch (InvocationTargetException e)
			{
				e.printStackTrace();
			}
		}
	}

	@Override
	public String getFileProviderAuthority()
	{
		return BuildConfig.APPLICATION_ID + ".provider";
	}

	@Override
	public void setPermissionListener(PermissionListener listener)
	{
		this.listener = listener;
	}

	@Override
	public void onRequestPermissionsResult(
		int requestCode,
		String[] permissions,
		int[] grantResults
	)
	{
		if (listener != null)
		{
			listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
		}
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
	}

}
