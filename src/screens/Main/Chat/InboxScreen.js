import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {
  RefreshControl,
  StyleSheet,
  Animated,
  FlatList,
  Keyboard,
  View,
} from 'react-native';

import ScreenWrapper from '../../../components/ScreenWrapper';
import {useSocket} from '../../../components/SocketProvider';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';

import Footer from './molecules/Footer';

import {get} from '../../../services/ApiRequest';
import {COLORS} from '../../../utils/COLORS';

const InboxScreen = ({route}) => {
  const socket = useSocket();
  const flatListRef = useRef(null);
  const data = route.params?.data;

  const {userData} = useSelector(state => state.users);
  const userId = userData?._id;
  const [scrolled, setScrolled] = useState(false);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', event => {
      setIsKeyboardVisible(true);
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', event => {
      setIsKeyboardVisible(false);
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleScroll = () => {
    setScrolled(true);
  };

  const fetchMessages = async () => {
    try {
      const response = await get(`auction/messages/${data?._id}`);
      if (response.data) {
        setLoading(false);
        setMessages(response.data?.messages);
      }
    } catch (error) {
      setLoading(false);
      console.log('errrrrrr', error);
    }
  };

  const getMoreMessages = async () => {
    try {
      if (messages?.length > 0 && !bottomLoader) {
        setBottomLoader(true);
        const lastId = messages[messages?.length - 1]?._id;
        const url = 'msg/messages/' + data?.id + '/' + 'User' + '/' + lastId;
        const response = await get(url);
        if (response.data?.success) {
          setMessages([...messages, ...response.data?.messages]);
        }
        setTimeout(() => {
          setBottomLoader(false);
          setScrolled(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error, 'in getting more msgs');
      setTimeout(() => {
        setBottomLoader(false);
        setScrolled(false);
      }, 1000);
    }
  };

  const sendMsg = () => {
    setInputText('');
    if (socket) {
      const body = {
        lot: data?._id,
        message: inputText,
        type: 'user',
      };
      socket.emit('send-lot-message', body, res => {
        setMessages(prevMessages => [res, ...prevMessages]);
      });
      setInputText('');
    } else {
      console.log('Socket is null or not properly initialized');
    }
  };

  useLayoutEffect(() => {
    if (data?._id) {
      fetchMessages();
    }
  }, [data?._id]);

  useEffect(() => {
    getMoreMessages();
  }, [scrolled]);
  useEffect(() => {
    if (socket) {
      socket.emit('seen-msg', {lot: data?._id, type: 'user'});
    }
  }, [socket]);

  const renderMessage = ({item}) => (
    <>
      <CustomText
        label={moment(item.createdAt).format('h:mm A')}
        color="#818898"
        fontSize={12}
        marginTop={5}
        alignSelf={
          item.sender === userId || item?.sender?._id === userId
            ? 'flex-end'
            : 'flex-start'
        }
      />
      <View
        style={[
          styles.messageContainer,
          item.sender === userId || item?.sender?._id === userId
            ? styles.userMessage
            : styles.otherMessage,
        ]}>
        <CustomText
          label={item?.message}
          color={
            item.sender === userId || item?.sender?._id === userId
              ? COLORS.white
              : COLORS.black
          }
          lineHeight={25}
        />
      </View>
    </>
  );

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', msg => {
        // if(msg?.conversationId === data?.lastMsg){
        setMessages(prevMessages => [msg, ...prevMessages]);
        // }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive-message');
      }
    };
  }, [socket]);

  return (
    <ScreenWrapper
      refreshControl={
        <RefreshControl refreshing={Loading} onRefresh={fetchMessages} />
      }
      paddingHorizontal={10}
      footerUnScrollable={() => (
        <Animated.View style={{marginBottom: keyboardHeight}}>
          <Footer
            inputText={inputText}
            setInputText={setInputText}
            sendMessage={sendMsg}
            pad={isKeyboardVisible}
          />
        </Animated.View>
      )}
      headerUnScrollable={() => <Header title={data?.name || 'Test'} />}>
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        keyExtractor={(_, i) => i.toString()}
        style={styles.messageList}
        onScrollEndDrag={handleScroll}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: COLORS.mainBg,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 14,
    borderRadius: 15,
    marginTop: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primaryColor,
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#6600001C',
    borderTopLeftRadius: 0,
  },
});

export default InboxScreen;
