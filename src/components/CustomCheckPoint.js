import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function CustomCheckPoint() {
  return (
    <View style={styles.container}>
      {/* Step 1 - Completed */}
      <View style={styles.stepContainer}>
        <View style={[styles.circle, styles.completed]}>
          <AntDesign name="check" size={12} color="white" />
        </View>
        <Text style={styles.label}>Step 1</Text>
      </View>

      <View style={styles.line} />

      {/* Step 2 - Active */}
      <View style={styles.stepContainer}>
        <View style={[styles.circle, styles.active]}>
          <Text style={styles.stepText}>2</Text>
        </View>
        <Text style={styles.label}>Step 2</Text>
      </View>

      <View style={styles.line} />

      {/* Step 3 - Inactive */}
      <View style={styles.stepContainer}>
        <View style={[styles.circle, styles.inactive]}>
          <Text style={styles.stepText}>3</Text>
        </View>
        <Text style={styles.label}>Step 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  stepContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completed: {
    backgroundColor: '#4CAF50',
  },
  active: {
    backgroundColor: '#2196F3',
  },
  inactive: {
    backgroundColor: '#ccc',
  },
  stepText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
    marginTop: -12,
  },
});
