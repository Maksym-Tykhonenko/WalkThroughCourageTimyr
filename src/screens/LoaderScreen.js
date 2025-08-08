import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import {
  ImageBackground,
  View,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
const { width: W, height: H } = Dimensions.get('window');
const TOP_IMG_SIZE = Math.min(W, H) * 0.8; // ~50% меншої сторони екрана
const LOADER_BOX = Math.min(W, H) * 0.6; // розмір вікна під лоудер

function LoaderScreen() {
  const appearingAnim = useRef(new Animated.Value(0)).current; // для верхнього Image
  const loaderAnim = useRef(new Animated.Value(0)).current; // для плавної появи лоудера (не обов’язково)

  useEffect(() => {
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 5500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(loaderAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  const LOADER_HTML = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
html,body{height:100%;margin:0;background:transparent}
.wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
.loader{animation:spin 1.5s linear alternate infinite;background:#B73F41;border-radius:50%;height:120px;width:120px;position:relative}
.loader:before{content:"";position:absolute;inset:0;margin:auto;background:#B73F41;border-radius:50%;height:.5em;width:.5em;z-index:2}
.loader:after{content:"";position:absolute;inset:0;margin:auto;background:#262E2A;border-radius:50%;height:2em;width:2em;
box-shadow:0 -2.60em #262E2A, 2.25em -4.02em #212121, 2.25em -1.25em #262E2A, 4.60em 0 #212121, 2.25em 1.25em #262E2A, 2.25em 4.02em #212121, 0 2.60em #262E2A, -2.25em 4.02em #212121, -2.25em 1.25em #262E2A, -4.60em 0 #212121, -2.25em -1.25em #262E2A, -2.25em -4.02em #212121}
.inner{position:absolute;inset:0;margin:auto;animation:load 1.5s linear alternate infinite;border:1px solid #B73F41;border-radius:50%;height:1.75em;width:1.75em;z-index:1}
@keyframes load{0%{box-shadow:0 -2.60em #262E2A,2.25em -1.25em #262E2A,2.25em 1.25em #262E2A,0 2.60em #262E2A,-2.25em 1.25em #262E2A,-2.25em -1.25em #262E2A}
15%{box-shadow:0 -2.60em #262E2A,2.25em -1.25em #262E2A,2.25em 1.25em #262E2A,0 2.60em #262E2A,-2.25em 1.25em #262E2A,-2.25em -1.25em #B73F41}
30%{box-shadow:0 -2.60em #262E2A,2.25em -1.25em #262E2A,2.25em 1.25em #262E2A,0 2.60em #262E2A,-2.25em 1.25em #B73F41,-2.25em -1.25em #B73F41}
45%{box-shadow:0 -2.60em #262E2A,2.25em -1.25em #262E2A,2.25em 1.25em #262E2A,0 2.60em #B73F41,-2.25em 1.25em #B73F41,-2.25em -1.25em #B73F41}
60%{box-shadow:0 -2.60em #262E2A,2.25em -1.25em #262E2A,2.25em 1.25em #B73F41,0 2.60em #B73F41,-2.25em 1.25em #B73F41,-2.25em -1.25em #B73F41}
75%{box-shadow:0 -2.60em #262E2A,2.25em -1.25em #B73F41,2.25em 1.25em #B73F41,0 2.60em #B73F41,-2.25em 1.25em #B73F41,-2.25em -1.25em #B73F41}
90%,100%{box-shadow:0 -2.60em #B73F41,2.25em -1.25em #B73F41,2.25em 1.25em #B73F41,0 2.60em #B73F41,-2.25em 1.25em #B73F41,-2.25em -1.25em #B73F41}}
@keyframes spin{0%{transform:rotate(0)}15%{transform:rotate(60deg)}30%{transform:rotate(120deg)}45%{transform:rotate(180deg)}60%{transform:rotate(240deg)}75%{transform:rotate(300deg)}90%{transform:rotate(360deg)}100%{transform:rotate(0)}}
</style></head>
<body>
<div class="wrap"><div class="loader"><div class="inner"></div></div></div>
</body></html>`;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/img/4c21b770ee8a793ac0683e7f3970a3e396057496.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Верхній логотип / картинка, що повільно з’являється */}
      <Animated.Image
        source={require('../assets/img/partOfLoader.png')}
        style={[
          styles.topImage,
          {
            opacity: appearingAnim,
            transform: [
              {
                translateY: appearingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
        resizeMode="contain"
      />

      {/* Нижній WebView з HTML-лоудером  <Animated.View style={[ { opacity: loaderAnim }]}></Animated.View>*/}

      <WebView
        originWhitelist={['*']}
        source={{ html: LOADER_HTML }}
        style={[styles.webview, styles.loaderBox]}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#02062b' },
  topImage: {
    position: 'absolute',
    top: H * 0.08, // “зверху” як на макеті
    alignSelf: 'center',
    width: TOP_IMG_SIZE,
    height: TOP_IMG_SIZE,
  },
  loaderBox: {
    position: 'absolute',
    bottom: H * 0.06, // відступ знизу як на макеті
    alignSelf: 'center',
    width: LOADER_BOX,
    height: LOADER_BOX,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default LoaderScreen;
