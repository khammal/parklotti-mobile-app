<div align="center">
    <img src="https://i.imgur.com/OdoSklj.jpg"  width="650">
</div>

ParkLotti is useful when you need to find cheap or free parking. Use our app to find parking near you!

# Install dependencies

```$ cd <project_root>```

```$ yarn install```

Only the first time you run the project, you need to generate a debug key with:

>```$ cd <project_root>/android/app```
	
>```$ keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000```

>```$ cd ../..```

# Decide how you want to run the app

There's a couple ways to set yourself up:

 **A)** Use production api endpoint + Run on physical device

 **B)** Use production api endpoint + Run on emulator


## OPTION A:

- **[A1]** Copy `.env.development.template` and call it `.env.development`.
 
 Update  this file to contain:
 
```
PARKLOTTI_API_URL=https://dev.parklotti.com/api
GOOGLE_MAPS_API_KEY=AIzaSyD1u7Df_FNdrkEWLeJMwaqDMEU5g2cn8UY
```

- **[A2]** Connect your device via usb. Make sure developer mode and usb debugging are enabled.

- **[A3]** Start up and build:

```$ yarn start``` (This will keep running)

```$ yarn android``` (In another terminal window)

## OPTION B:

- Do step **[A1]**

- Start up an android emulator

- Do step **[A3]**
