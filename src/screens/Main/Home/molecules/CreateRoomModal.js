import {Image, StyleSheet, View} from 'react-native';
import {useEffect, useMemo, useState} from 'react';

import CustomToggle from '../../../../components/CustomToggle';
import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import CustomInput from '../../../../components/CustomInput';
import CustomText from '../../../../components/CustomText';

import {tabIcons} from '../../../../assets/images/tabIcons';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const CreateRoomModal = ({isVisible, onDisable, onPress, isEdit}) => {
  const init = {
    name: '',
    description: '',
    discord: '',
    youtube: '',
    isPrivate: false,
  };
  const inits = {
    nameError: '',
    descriptionError: '',
  };

  const [errors, setErrors] = useState(inits);
  const [state, setState] = useState(init);
  const [loading, setLoading] = useState(false);
  const array = [
    {
      placeholder: 'Room Name',
      value: state.name,
      onChangeText: text => setState({...state, name: text}),
      error: errors.nameError,
    },
    {
      placeholder: 'Description',
      multiline: true,
      height: 133,
      value: state.description,
      onChangeText: text => setState({...state, description: text}),
      error: errors.descriptionError,
    },
    {
      placeholder: 'Discord Link (Optional)',
      value: state.discord,
      onChangeText: text => setState({...state, discord: text}),
    },
    {
      placeholder: 'Youtube Link (Optional)',
      value: state.youtube,
      onChangeText: text => setState({...state, youtube: text}),
    },
  ];
  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (!state.name) newErrors.nameError = 'Please enter Room Name';
      else if (!state.description)
        newErrors.descriptionError = 'Please enter Description';

      setErrors(newErrors);
    };
  }, [state]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);
  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      onPress();
      setLoading(false);
    }, 1000);
  };
  return (
    <CustomModal isChange isVisible={isVisible} onDisable={onDisable}>
      <View style={styles.mainContainer}>
        <Image source={tabIcons.room} style={styles.room} />
        <CustomText
          label={isEdit ? 'Room Setting' : 'Create Room'}
          fontSize={24}
          fontFamily={fonts.bold}
          marginTop={10}
          marginBottom={20}
        />
        {isEdit ? null : (
          <CustomText
            label="A Playback room is your dedicated area to stream alongside your community."
            textAlign="center"
            fontSize={18}
            marginBottom={20}
          />
        )}

        {array.map((item, i) => (
          <CustomInput
            key={i}
            placeholder={item?.placeholder}
            multiline={item?.multiline}
            height={item.height}
            value={item}
            onChangeText={item?.onChangeText}
            error={item?.error}
          />
        ))}
        <View style={styles.row}>
          <CustomText
            label="Private"
            fontFamily={fonts.semiBold}
            fontSize={18}
          />
          <CustomToggle
            value={state.isPrivate}
            setValue={() =>
              setState(prev => ({...prev, isPrivate: !prev.isPrivate}))
            }
          />
        </View>
        <CustomButton
          title={isEdit ? 'Save' : 'Create New Room'}
          onPress={handleCreate}
          loading={loading}
          disabled={Object.keys(errors).some(key => errors[key] !== '')}
          marginBottom={10}
          marginTop={30}
        />
      </View>
    </CustomModal>
  );
};

export default CreateRoomModal;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    borderTopRightRadius: 44,
    borderTopLeftRadius: 44,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    padding: 20,
  },
  room: {
    width: 54,
    height: 54,
    tintColor: COLORS.white,
    resizeMode: 'contain',
    marginTop: 10,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
