import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SearchCardSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      
      <View style={styles.content}>
        <View style={styles.categoryLine} />
        <View style={styles.titleLine} />
        <View style={styles.metaLine} />
      </View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    height: 230,
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 12,
  },
  categoryLine: {
    width: '30%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  titleLine: {
    width: '85%',
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  metaLine: {
    width: '50%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
  },
});

export default SearchCardSkeleton;
