import { View, Text } from 'react-native';

export const Message = ({ text, user, email, time }) => {
  return (
    <View>
      <Text
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          textAlign: user.email === email ? 'right' : 'left',
        }}>
        <View
          style={{
            backgroundColor: '#000000',
            borderTopRightRadius: user.email === email ? 0 : 15,
            borderBottomRightRadius: 15,
            borderTopLeftRadius: user.email !== email ? 0 : 15,
            borderBottomLeftRadius: 10,
            width: text.length < 200 ? 190 : 260,
          }}>
          <Text
            style={{
              color: 'white',
              margin: 5,
              justifyContent: 'space-evenly',
            }}>
            {text}
          </Text>
          <View style={{ display: 'flex' }}>
            <HelperText style={{ marginLeft: 'auto', color: '#ffffff' }}>
              {moment(time).format('hh:mm a')}
            </HelperText>
          </View>
        </View>
      </Text>
    </View>
  );
};
