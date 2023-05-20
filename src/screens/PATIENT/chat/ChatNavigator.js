import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar, Box, HStack, VStack, Spacer, Spinner } from 'native-base';
import dayjs from 'dayjs';
import { getChatRooms } from '../../../services/user';
import { useNavigation } from '../../../context/context';
import UserImage from '../../../../assets/images/userImage.png';
import User from '../../../../assets/svg/user.svg';

const trimMessage = message => {
  try {
    if (message) {
      if (message.length >= 35) {
        return `${message.substring(0, 35)}...`;
      } else {
        return message;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const ChatNavigator = () => {
  const scrollViewRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const { navigation } = useNavigation();

  const [chatRooms, setChatRooms] = useState([]);
  const [showLoader, setShowLoader] = useState({});
  const { user } = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetChatRooms();
    setRefreshing(false);
  }, []);

  const handleChatSelection = ({ roomId, participants }) => {
    try {
      const name =
        user.designation === 'patient'
          ? `Dr. ${participants['doctor']?.name}`
          : participants['patient']?.name;

      navigation.navigate('Message', { roomId, name });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetChatRooms = async () => {
    try {
      setShowLoader(true);
      const response = await getChatRooms();
      setChatRooms(response.rooms);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  //   useEffect(() => {
  //     handleGetChatRooms();
  //     console.log('ChatNavigator rendering...');
  //   }, []);

  useFocusEffect(
    useCallback(() => {
      handleGetChatRooms();
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {showLoader ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
          }}>
          <Spinner size={30} />
        </View>
      ) : (
        <FlatList
          style={{ margin: 5 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={chatRooms}
          renderItem={({ item }, index) => (
            <View key={item.roomId}>
              {item?.lastMessage && (
                <>
                  <Pressable
                    onPress={() =>
                      handleChatSelection({
                        roomId: item.roomId,
                        participants: item.participants,
                      })
                    }>
                    <Box
                      borderBottomWidth="1"
                      _dark={{
                        borderColor: '#fafafa',
                      }}
                      borderColor="#e5e5e5"
                      pl={['0', '4']}
                      pr={['0', '5']}
                      py="3"
                      key={item.roomId}>
                      <HStack space={[2, 3]} justifyContent="space-between">
                        <View>
                          <View
                            style={{
                              borderRadius: 50,
                              backgroundColor: '#e5e5e5',
                            }}>
                            <User width={45} height={45} />
                          </View>
                        </View>

                        <VStack>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Medium',
                              color: 'black',
                            }}
                            bold>
                            {user.designation === 'patient'
                              ? item.participants['doctor']?.name
                              : item.participants['patient']?.name}{' '}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              color: 'black',
                            }}>
                            {trimMessage(item?.lastMessage?.text)}
                          </Text>
                        </VStack>
                        <Spacer />
                        <VStack>
                          <Text
                            fontSize="xs"
                            _dark={{
                              color: '#fafaf9',
                            }}
                            color="#1f2937"
                            alignSelf="flex-start">
                            {dayjs(new Date()).format('YYYY-MM-DD') ===
                            dayjs(item?.lastMessage?.createdAt).format(
                              'YYYY-MM-DD',
                            )
                              ? dayjs(item?.lastMessage?.createdAt).format(
                                  'hh:mm A',
                                )
                              : dayjs(item?.lastMessage?.createdAt).format(
                                  'DD/MM/YY',
                                )}
                          </Text>
                          <Text
                            fontSize="xs"
                            _dark={{
                              color: '#fafaf9',
                            }}
                            color="#1f2937"
                            alignSelf="flex-start"
                            style={{ marginTop: 5 }}>
                            {item.roomId.split('-')[0]}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </Pressable>
                </>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ChatNavigator;
