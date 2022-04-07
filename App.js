import type {Node} from 'react';
import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const offset = useSharedValue(0);

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    {
      checkInverted: true,
    },
  );

  const defaultSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withSpring(offset.value * 255)}],
    };
  });

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value * 255, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    };
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />

        <Animated.View style={[styles.box, defaultSpringStyles]} />
        <Animated.View style={[styles.box, customSpringStyles]} />
        <Button onPress={() => (offset.value = Math.random())} title="Move" />
        {hasPermission && device ? (
          <>
            <View style={styles.view}>
              <Camera
                style={styles.absoluteFill}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
              />

              <View style={styles.view}>
                <Text style={styles.sectionDescription}>'displayValue}'</Text>
                {barcodes.map((barcode, idx) => (
                  <Text key={idx} style={styles.sectionDescription}>
                    {barcode.displayValue}
                  </Text>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    height: 300,
    width: 400,
    borderColor: 'red',
    borderWidth: 4,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
