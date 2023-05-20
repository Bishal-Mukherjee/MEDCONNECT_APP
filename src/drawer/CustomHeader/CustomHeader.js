import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { HStack, VStack, Badge, IconButton, Box } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const CustomHeader = ({ params, disableMessageIcon = false }) => {
  const { navigation, route } = params;

  return (
    <View>
      <HStack
        direction="row"
        alignItems="center" // center vertically
        style={{ height: 55, backgroundColor: '#293241' }}>
        <View>
          <IconButton
            icon={
              <MaterialIcon
                name={disableMessageIcon ? 'menu' : 'chevron-left'}
                size={25}
                color={'white'}
              />
            }
            onPress={() =>
              disableMessageIcon
                ? navigation.openDrawer()
                : navigation.navigate('Appointments')
            }
            _pressed={{ bg: 'none' }}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Poppins-Medium',
              color: 'white',
            }}>
            {route.name}
          </Text>
        </View>
        {disableMessageIcon ? (
          <View style={{ marginLeft: 'auto', marginRight: 15 }}>
            <Box alignItems="center">
              <VStack>
                <Badge
                  colorScheme="danger"
                  rounded="full"
                  mb={-5}
                  mr={-2}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 10,
                  }}>
                  2
                </Badge>

                <IconButton
                  onPress={() => navigation.navigate('Messages')}
                  icon={
                    <MaterialIcon
                      name="chat-bubble"
                      size={25}
                      color={'white'}
                    />
                  }
                  _pressed={{ bg: 'none' }}
                  mx={{
                    base: 'auto',
                    md: 0,
                  }}
                  p="2"
                />
              </VStack>
            </Box>
          </View>
        ) : null}
      </HStack>
    </View>
  );
};
