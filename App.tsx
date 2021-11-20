import React, { useState } from 'react'
import {
  NativeBaseProvider,
  extendTheme,
} from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import AppLoading from 'expo-app-loading'
import { Asset } from 'expo-asset'
import Font from 'expo-font'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from './src/navigations/index'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const theme = extendTheme({ config })

const App: React.FC = () => {
  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const _loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/splash.png'),
        require('./assets/icon.png'),
        require('./assets/favicon.png'),
      ]),
      Font.loadAsync({
        ...FontAwesome.font,
      }),
    ])
    return
  }
  const _handleLoadingError = (error: Error) => { }
  const _handleFinishLoading = () => setLoadingComplete(true)
  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    )
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <Navigation />
        </NativeBaseProvider>
      </SafeAreaProvider>
    )
  }
}

export default App
