import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';

// Import your custom components
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImageUI from '../../../components/UploadImageUI';
import Dropdown from '../../../components/Dropdown';
import OTPComponent from '../../../components/OTP';
import fonts from '../../../assets/fonts';

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  
  // City options for dropdown
  const cityOptions = [
    { label: 'Select City', value: '' },
    { label: 'Kuala Lumpur', value: 'kuala_lumpur' },
    { label: 'Penang', value: 'penang' },
    { label: 'Johor Bahru', value: 'johor_bahru' },
    { label: 'Ipoh', value: 'ipoh' },
  ];

  // Main form state
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    plate: '',
    model: '',
    registrationNumber: '',
    cnic: '',
    document: null,
    accountNumber: '',
    selectedBank: '',
    selectedArea: 'selangor',
    selectedCity: '',
  });

  // Documents state
  const [documents, setDocuments] = useState({
    icFront: null,
    icBack: null,
    licenseFront: null,
    licenseBack: null,
    psvLicense: null,
    jobPermit: null,
  });

  // Errors state
  const [errors, setErrors] = useState({});

  // City options
 
  // Bank options
  const bankOptions = [
    { label: 'Select Bank Name', value: '' },
    { label: 'Maybank', value: 'maybank' },
    { label: 'CIMB Bank', value: 'cimb' },
    { label: 'Public Bank', value: 'public' },
    { label: 'RHB Bank', value: 'rhb' },
  ];

  // Area options
  const areaOptions = [
    { label: 'Selangor', value: 'selangor' },
    { label: 'Kuala Lumpur', value: 'kl' },
    { label: 'Penang', value: 'penang' },
  ];

  // Handle document upload
  const handleDocumentUpload = (documentType, image) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: image
    }));
  };

  // Update state helper
  const updateState = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validation function
  const validateStep = (stepNumber) => {
    let hasErrors = false;
    let newErrors = {};

    if (stepNumber === 1) {
      // First name validation
      if (!state.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        hasErrors = true;
      }

      // Last name validation
      if (!state.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        hasErrors = true;
      }

      // Email validation
      if (!state.email.trim()) {
        newErrors.email = 'Email is required';
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(state.email)) {
        newErrors.email = 'Invalid email format';
        hasErrors = true;
      }

      // Password validation
      if (!state.password.trim()) {
        newErrors.password = 'Password is required';
        hasErrors = true;
      } else if (state.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        hasErrors = true;
      }

      // Confirm password validation
      if (!state.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Confirm password is required';
        hasErrors = true;
      } else if (state.password !== state.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        hasErrors = true;
      }

      // Phone number validation
      if (!state.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
        hasErrors = true;
      }

      // City validation
     
    }

    if (stepNumber === 2) {
      // OTP validation
      if (!otp.trim() || otp.length !== 4) {
        newErrors.otp = 'Please enter a valid 4-digit OTP';
        hasErrors = true;
      }
    }

    if (stepNumber === 3) {
      // Registration number validation
      if (!state.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Registration number is required';
        hasErrors = true;
      }

      // CNIC validation
      if (!state.cnic.trim()) {
        newErrors.cnic = 'CNIC is required';
        hasErrors = true;
      }

      // Bank validation
      if (!state.selectedBank) {
        newErrors.selectedBank = 'Bank selection is required';
        hasErrors = true;
      }

      // Account number validation
      if (!state.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
        hasErrors = true;
      }

      // IC documents validation
      if (!documents.icFront || !documents.icBack) {
        newErrors.ic = 'Both IC front and back are required';
        hasErrors = true;
      }

      // License documents validation
      if (!documents.licenseFront || !documents.licenseBack) {
        newErrors.license = 'Both license front and back are required';
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    return hasErrors;
  };

  // Handle next step
  const handleNext = () => {
    const hasErrors = validateStep(step);
    if (!hasErrors) {
      setStep(prev => prev + 1);
    }
  };

  // Handle signup completion
  // const handleSignup = async () => {
  //   const hasErrors = validateStep(step);
  //   if (!hasErrors) {
  //     try {
  //       setLoading(true);
  //       // Navigate to AllDone screen with proper navigation method
  //       navigation.replace('AllDone');
  //     } catch (error) {
  //       console.error('Signup error:', error);
  //       Alert.alert('Error', 'Something went wrong. Please try again.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };


  const handleSignup = () => {
    navigation.navigate('Vehicle');
    
  }





  // Render progress bar
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
    </View>
  );

  // Define step rendering functions before they're used
  const renderStep1 = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Nice to meet you!</Text>
      <Text style={styles.stepSubtitle}>Please tell us more about you</Text>

      <CustomText
        label="First Name"
        fontSize={15}
        marginTop={30}
        fontWeight="500"
      />
      <CustomInput
        placeholder="First Name"
        marginTop={10}
        value={state.firstName}
        onChangeText={(text) => updateState('firstName', text)}
        error={errors.firstName}
      />

      <CustomText
        label="Last Name"
        fontSize={15}
        marginTop={15}
        fontWeight="500"
      />
      <CustomInput
        placeholder="Last Name"
        marginTop={10}
        value={state.lastName}
        onChangeText={(text) => updateState('lastName', text)}
        error={errors.lastName}
      />

      <CustomText
        label="Email Address"
        fontSize={15}
        marginTop={15}
        fontWeight="500"
      />
      <CustomInput
        placeholder="Your Email Address"
        marginTop={10}
        keyboardType="email-address"
        autoCapitalize="none"
        value={state.email}
        onChangeText={(text) => updateState('email', text)}
        error={errors.email}
      />

      <CustomText
        label="Phone Number"
        fontSize={15}
        marginTop={15}
        fontWeight="500"
      />
      <CustomInput
        placeholder="Phone Number"
        marginTop={10}
        keyboardType="phone-pad"
        value={state.phoneNumber}
        onChangeText={(text) => updateState('phoneNumber', text)}
        error={errors.phoneNumber}
      />

      <CustomText
        label="Password"
        fontSize={15}
        marginTop={15}
        fontWeight="500"
      />
      <CustomInput
        placeholder="Password"
        marginTop={10}
        secureTextEntry
        value={state.password}
        onChangeText={(text) => updateState('password', text)}
        error={errors.password}
      />

      <CustomText
        label="Confirm Password"
        fontSize={15}
        marginTop={15}
        fontWeight="500"
      />
      <CustomInput
        placeholder="Confirm Password"
        marginTop={10}
        secureTextEntry
        value={state.confirmPassword}
        onChangeText={(text) => updateState('confirmPassword', text)}
        error={errors.confirmPassword}
      />

      <CustomText
        label="City"
        fontSize={15}
        marginTop={15}
        fontWeight="500"
      />
      <View style={styles.dropdownContainer}>
        <Dropdown
          items={cityOptions}
          selectedValue={state.selectedCity}
          onValueChange={(value) => updateState('selectedCity', value)}
          error={errors.selectedCity}
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <View style={styles.otpContainer}>
      <CustomText
        label={`Enter 5-digit code we just texted to your phone number ${state.phoneNumber}`}
        fontFamily={fonts.medium}
        marginBottom={30}
        marginTop={10}
        lineHeight={24}
        fontSize={16}
        textAlign="center"
      />
      
      <OTPComponent value={otp} setValue={setOtp} />
      {errors.otp && (
        <Text style={styles.errorText}>{errors.otp}</Text>
      )}

      <View style={styles.resendContainer}>
        <TouchableOpacity>
          <Text style={styles.resendText}>Resend code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.step3Container}>
      <Text style={styles.documentsTitle}>Upload Documents</Text>

     

      {/* IC Upload */}
      <View style={styles.documentSection}>
        <Text style={styles.documentTitle}>ID (Front & Back)</Text>
        <View style={styles.uploadGrid}>
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>Front</Text>
            <UploadImageUI
              onImageSelected={(image) => handleDocumentUpload('icFront', image)}
              label="ID Front"
            />
          </View>
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>Back</Text>
            <UploadImageUI
              onImageSelected={(image) => handleDocumentUpload('icBack', image)}
              label="ID Back"
            />
          </View>
        </View>
        {errors.ic && (
          <Text style={styles.errorText}>{errors.ic}</Text>
        )}
      </View>

      {/* Driving License Upload */}
      <View style={styles.documentSection}>
        <Text style={styles.documentTitle}>Driving License (Front & Back)</Text>
        <View style={styles.uploadGrid}>
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>Front</Text>
            <UploadImageUI
              onImageSelected={(image) => handleDocumentUpload('licenseFront', image)}
              label="License Front"
            />
          </View>
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>Back</Text>
            <UploadImageUI
              onImageSelected={(image) => handleDocumentUpload('licenseBack', image)}
              label="License Back"
            />
          </View>
        </View>
        {errors.license && (
          <Text style={styles.errorText}>{errors.license}</Text>
        )}
      </View>

      {/* Other Documents */}
      <View style={styles.section}>
        <View style={styles.documentButton}>
          <Text style={styles.documentButtonText}>PSV License</Text>
          <UploadImageUI
            onImageSelected={(image) => handleDocumentUpload('psvLicense', image)}
            label="PSV License"
            compact={true}
          />
        </View>
        <View style={styles.documentButton}>
          <Text style={styles.documentButtonText}>Job Permit</Text>
          <UploadImageUI
            onImageSelected={(image) => handleDocumentUpload('jobPermit', image)}
            label="Job Permit"
            compact={true}
          />
        </View>
      </View>

      {/* CNIC */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CNIC</Text>
        <TextInput
          style={styles.textInput}
          placeholder="CNIC Number"
          value={state.cnic}
          onChangeText={(text) => updateState('cnic', text)}
          placeholderTextColor="#9CA3AF"
        />
        {errors.cnic && (
          <Text style={styles.errorText}>{errors.cnic}</Text>
        )}
      </View>

      {/* Bank Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Details</Text>
        <View style={styles.dropdownContainer}>
          <Dropdown
            items={bankOptions}
            selectedValue={state.selectedBank}
            onValueChange={(value) => updateState('selectedBank', value)}
            error={errors.selectedBank}
            placeholder="Select Bank"
          />
        </View>
        {errors.selectedBank && (
          <Text style={styles.errorText}>{errors.selectedBank}</Text>
        )}
        
        <TextInput
          style={styles.textInput}
          placeholder="Account Number"
          value={state.accountNumber}
          onChangeText={(text) => updateState('accountNumber', text)}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        {errors.accountNumber && (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        )}
      </View>

      {/* Area of Operation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Area of Operation</Text>
        


        <View style={styles.dropdownContainer}>
          <Dropdown
            items={areaOptions}
            selectedValue={state.selectedArea}
            onValueChange={(value) => updateState('selectedArea', value)}
            error={errors.selectedArea}
            placeholder="Select Area"
          />
        </View>
      </View>
    </ScrollView>
  );

  // Define renderStep function after all step rendering functions are defined
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenWrapper scrollEnabled={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step {step} of 3</Text>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        <View style={styles.stepContent}>
          {renderStep()}
        </View>

        {/* Continue/Done Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={step < 3 ? 'Continue' : 'Complete Registration'}
            onPress={step < 3 ? handleNext : handleSignup}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#1F2937',
  },
    buttonContainer: {
      marginTop: 10,
    },
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  dropdownContainer: {
    marginTop: 1,
  },
  otpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resendContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  step3Container: {
    flex: 1,
  },
  documentsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  documentSection: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  uploadGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  uploadItem: {
    flex: 1,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  documentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  documentButtonText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorBorder: {
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
  },
});

export default Signup;