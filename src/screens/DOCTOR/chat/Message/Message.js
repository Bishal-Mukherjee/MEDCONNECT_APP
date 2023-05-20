import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HStack, Input, Spinner } from 'native-base';
import { Formik } from 'formik';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import dayjs from 'dayjs';
import { useNavigation } from '../../../../context/context';
import { getRoomMessages } from '../../../../services/user';

export const MessageDate = ({ time }) => {
  const extractYear = params => {
    try {
      const day = params.split('T')[0].split('-')[2];
      if (day === '01') {
        return { day, suffix: 'st' };
      }
      if (day === '02') {
        return { day, suffix: 'nd' };
      }
      if (day === '03') {
        return { day, suffix: 'rd' };
      }
      return { day, suffix: 'th' };
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        elevation: 5,
      }}>
      <View
        style={{
          backgroundColor: '#94a3b8',
          borderRadius: 10,
          alignContent: 'center',
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Poppins-Medium',
          }}>
          {extractYear(time).day}
          {extractYear(time).suffix} {dayjs(time).format('MMMM')}{' '}
        </Text>
      </View>
    </View>
  );
};

const ComponentHeader = ({ name, showLoader }) => {
  const { navigation } = useNavigation();
  return (
    <View style={{ width: '100%', height: 60, backgroundColor: '#e7e5e4' }}>
      <HStack
        style={{
          margin: 10,
          alignItems: 'center',
          height: '80%',
          width: '90%',
        }}>
        <Pressable onPress={() => navigation.navigate('Messages')}>
          <MaterialIcon name="chevron-left" size={25} />
        </Pressable>
        <Text
          style={{ fontFamily: 'Poppins-Medium', fontSize: 20, marginLeft: 5 }}>
          {name}
        </Text>
        {showLoader && (
          <View style={{ marginLeft: 'auto' }}>
            <Spinner size={20} />
          </View>
        )}
      </HStack>
    </View>
  );
};

const MessageInput = ({
  handleChange,
  handleSubmit,
  handleReset,
  values,
  scrollViewRef,
}) => {
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const { name, uri, size } = result[0];
      console.log({ name, uri, size });
      //   console.log(
      //     result.uri,
      //     result.type, // mime type
      //     result.name,
      //     result.size,
      //   );
      // Call the upload function here with the selected file
      // uploadFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        // Error occurred while picking the file
        console.log('Error occurred while picking the file:', err);
      }
    }
  };

  return (
    <View>
      <Input
        variant="filled"
        placeholder="Type a message..."
        onChangeText={handleChange('text')}
        value={values.text}
        onPressIn={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        style={{
          height: 45,
          fontFamily: 'Poppins-Regular',
          backgroundColor: '#e5e5e5',
        }}
        _focus={{ borderColor: 'none' }}
        InputRightElement={
          <View
            style={{
              width: 80,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#e5e5e5',
              height: '100%',
            }}>
            <Pressable onPress={() => handlePickFile()}>
              <FeatherIcon
                name="paperclip"
                size={25}
                style={{ marginRight: 5, marginTop: 10 }}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                handleSubmit();
                setTimeout(() => {
                  handleReset();
                }, 300);
              }}
              disabled={values.text.length === 0 ? true : false}
              style={{ marginTop: 10 }}>
              <MaterialIcon
                name="send"
                size={25}
                style={{
                  marginRight: 10,
                  color: values.text.length === 0 ? '#d4d4d4' : '#002851',
                }}
              />
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

const PrimaryUser = ({ text, createdAt }) => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginBottom: 5,
      }}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          textAlign: 'left',
          backgroundColor: '#4aa9ff',
          elevation: 2,
          width: '60%',
          borderRadius: 10,
        }}>
        <>
          <View>
            <Text
              style={{
                color: 'white',
                margin: 5,
                justifyContent: 'space-evenly',
                fontFamily: 'Poppins-Regular',
              }}>
              {text}
            </Text>
          </View>

          <View style={{ display: 'flex', marginRight: 5, marginBottom: 5 }}>
            <Text
              style={{
                marginLeft: 'auto',
                color: 'white',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
              }}>
              {dayjs(createdAt).format('hh:mm a')}
            </Text>
          </View>
        </>
      </View>
    </View>
  );
};

const SecondaryUser = ({ text, createdAt }) => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 5,
      }}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          textAlign: 'left',
          backgroundColor: '#e2e8f0',
          elevation: 2,
          width: '60%',
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: 'black',
            margin: 5,
            justifyContent: 'space-evenly',
            fontFamily: 'Poppins-Regular',
          }}>
          {text}
        </Text>
        <View style={{ display: 'flex', marginRight: 5, marginBottom: 5 }}>
          <Text
            style={{
              marginLeft: 'auto',
              color: 'black',
              fontSize: 12,
              fontFamily: 'Poppins-Regular',
            }}>
            {dayjs(createdAt).format('hh:mm a')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Message = ({ text, email, createdAt, showDate }) => {
  const { user } = useNavigation();
  return (
    <View>
      {showDate && (
        <View>
          <MessageDate time={createdAt} />
        </View>
      )}
      {user && (
        <Fragment>
          {user.email === email ? (
            <PrimaryUser text={text} createdAt={createdAt} />
          ) : (
            <SecondaryUser text={text} createdAt={createdAt} />
          )}
        </Fragment>
      )}
    </View>
  );
};

const ChatRoom = ({ route }) => {
  const { roomId, name } = route.params;
  const scrollViewRef = useRef();
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState('');
  const [skip, setSkip] = useState(0);

  const { user, socket_connection } = useNavigation();

  const handleFetchMessages = async () => {
    try {
      setLoader('main');
      const response = await getRoomMessages({
        roomId,
        skip,
      });
      console.log(response.messages);
      setMessages(response.messages);
      setLoader('');
      if (messages.length > 0)
        scrollViewRef.current.scrollToEnd({ animated: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSendMessage = useCallback(params => {
    socket_connection.emit('message', {
      email: user.email,
      text: params.text,
      roomId,
    });
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  const handleIncomingMessage = useCallback(params => {
    if (params.roomId === roomId) {
      setMessages(prevstate => [
        ...prevstate,
        { email: params.email, text: params.text, createdAt: params.createdAt },
      ]);
    }
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  const handleNextSetOfMessages = async () => {
    try {
      if (skip !== 0) {
        setLoader('sub');
        const response = await getRoomMessages({
          roomId,
          skip,
          clientMessagesCount: messages.length,
        });
        setLoader('');
        if (response.messages.length > 0) {
          setMessages(prevstate => [...response.messages, ...prevstate]);
        } else {
          console.log('no more messages to fetch');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleScroll = event => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY === 0) {
      console.log('Reached top of content');
      setSkip(prevstate => prevstate + 10);
    }
  };

  const showDate = messageIndex => {
    try {
      const extractYear = params => params.split('T')[0];

      if (messageIndex === 0) {
        return true;
      }
      if (
        extractYear(messages[messageIndex].createdAt) !==
        extractYear(messages[messageIndex - 1].createdAt)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleNextSetOfMessages();
  }, [skip]);

  useEffect(() => {
    socket_connection.emit('joinroom', { roomId });
    socket_connection.on('message', params => handleIncomingMessage(params));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSkip(0);
      setMessages([]);
      handleFetchMessages();
    }, [route.params]),
  );

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <ComponentHeader name={name} showLoader={loader === 'sub'} />
        {loader === 'main' ? (
          <>
            <View
              style={{
                justifyContent: 'center',
                height: '100%',
              }}>
              <Spinner size={30} />
            </View>
          </>
        ) : (
          <>
            <View style={{ paddingBottom: 10 }}>
              <ScrollView
                style={{
                  marginBottom: 100,
                  paddingBottom: 50,
                }}
                ref={scrollViewRef}
                onScroll={handleScroll}>
                {messages.map((message, index) => (
                  <Message
                    {...message}
                    key={index}
                    showDate={showDate(index)}
                  />
                ))}
              </ScrollView>
            </View>
            <View style={styles.bottom}>
              <Formik
                initialValues={{ text: '' }}
                onSubmit={values => handleSendMessage(values)}>
                {({ handleChange, handleSubmit, handleReset, values }) => (
                  <View>
                    <MessageInput
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      handleReset={handleReset}
                      values={values}
                      scrollViewRef={scrollViewRef}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: '100%',
  },
  bottom: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
});
