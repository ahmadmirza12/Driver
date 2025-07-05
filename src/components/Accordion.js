import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  UIManager,
  Animated,
  Platform,
  View,
  Image,
} from 'react-native';

import CustomText from './CustomText';

import {PNGIcons} from '../assets/images/icons';
import {COLORS} from '../utils/COLORS';
import fonts from '../assets/fonts';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({title, description, defaultOpen = false}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const rotateAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const heightAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const [bodyHeight, setBodyHeight] = useState(0);

  const toggleAccordion = () => {
    // Configure custom animation
    const config = {
      duration: 500,
      update: {
        duration: 500,
        property: LayoutAnimation.Properties.opacity,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        duration: 500,
        property: LayoutAnimation.Properties.opacity,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    };

    LayoutAnimation.configureNext(config);

    // Animate rotation
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate height
    Animated.timing(heightAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    setIsOpen(!isOpen);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Calculate body height on initial render
  const onBodyLayout = event => {
    if (bodyHeight === 0) {
      setBodyHeight(event.nativeEvent.layout.height);
    }
  };

  // Custom enter animation
  const fadeInScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeInScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeInScale.setValue(0);
    }
  }, [isOpen]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, isOpen ? styles.border : {}]}
        onPress={toggleAccordion}
        activeOpacity={0.7}>
        <CustomText label={title} fontFamily={fonts.bold} fontSize={18} />
        <Animated.View style={{transform: [{rotate: spin}]}}>
          <Image source={PNGIcons.arrowDown} style={styles.arrowDown} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            styles.bodyContent,
            {
              opacity: fadeInScale,
              transform: [
                {
                  translateY: fadeInScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
          onLayout={onBodyLayout}>
          <CustomText
            label={description}
            color={COLORS.tabIcon}
            fontFamily={fonts.medium}
            lineHeight={21}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.inputBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  bodyContent: {
    padding: 15,
    paddingTop: 0,
  },
  arrowDown: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  border: {
    borderBottomWidth: 1,
    borderBlockColor: COLORS.darkGray,
    marginBottom: 10,
  },
});

export default Accordion;
