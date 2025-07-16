import 'dotenv/config';

export default {
  expo: {
    name: "siteObservations",
    slug: "cogram",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app uses your location to tag photos."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "ACCESS_FINE_LOCATION"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      API_URL: process.env.API_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      eas: {
        projectId: "489e5179-5f0f-4347-82e8-ab7c86681a38"
      }
    },
    owner: "analogfuture",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/489e5179-5f0f-4347-82e8-ab7c86681a38"
    }
  }
};
