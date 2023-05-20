import React, { useEffect, useState } from 'react';
import { View, Text, BackHandler, Pressable, ScrollView } from 'react-native';
import { FlatList, Input, Actionsheet, Center, Button, Box } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import debounce from 'lodash.debounce';
import { useNavigation } from '../../../../context/context';
import { SYMPTOMS } from '../../../../constants/constants';

const Searchbar = ({
  formik,
  showAppointments,
  setShowAppointments,
  handleAddSymptom,
  dieaseObj,
  isOpen,
  setIsOpen,
}) => {
  const { navigation } = useNavigation();
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleChange = () => {
    try {
      const inputValue = formik.values.symptom;
      if (inputValue.length > 0) {
        const temp = SYMPTOMS.filter(s =>
          String(s)
            .toLowerCase()
            .includes(String(formik.values.symptom).toLowerCase()),
        );
        setFilteredOptions(temp);
      } else {
        setFilteredOptions([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const debounced = debounce(handleChange, 500);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        if (!showAppointments) {
          setShowAppointments(true);
        } else {
          BackHandler.exitApp();
        }
      }),

    [showAppointments],
  );

  useEffect(() => {
    debounced();
  }, [formik.values.symptom]);

  return (
    <View>
      <View style={{ margin: 10 }}>
        <Input
          variant="filled"
          placeholder="Enter symptoms"
          style={{
            backgroundColor: '#e5e5e5',
            fontFamily: 'Poppins-Regular',
            height: 60,
            fontSize: 15,
          }}
          _focus={{ borderColor: 'none' }}
          name="symptom"
          value={formik.values.symptom}
          onChangeText={formik.handleChange('symptom')}
          onBlur={formik.handleBlur('symptom')}
          onFocus={() => {
            setShowAppointments(false);
          }}
          InputRightElement={
            <>
              <Pressable
                style={{
                  backgroundColor: '#e5e5e5',
                  height: '100%',
                }}
                onPress={() => {
                  if (filteredOptions.length === 0)
                    setFilteredOptions(SYMPTOMS);
                  else setFilteredOptions([]);
                }}>
                <MaterialIcon
                  name="keyboard-arrow-down"
                  size={30}
                  style={{ marginTop: 15, marginRight: 5 }}
                />
              </Pressable>
            </>
          }
          helperText={
            formik.errors.symptom && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: 'red',
                }}>
                {formik.errors.symptom}
              </Text>
            )
          }
        />
      </View>

      {filteredOptions.length ? (
        <FlatList
          data={filteredOptions}
          renderItem={({ item }) => (
            <Pressable
              style={{ margin: 5 }}
              onPress={() => {
                handleAddSymptom(item);
                setFilteredOptions([]);
              }}>
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>
                {item}
              </Text>
            </Pressable>
          )}
          style={{
            margin: 10,
            marginTop: 80,
            height:
              filteredOptions.length * 35 > 150
                ? 150
                : filteredOptions.length * 35,
            position: 'absolute',
            backgroundColor: '#e5e5e5',
            borderRadius: 5,
            width: '95%',
            zIndex: 1,
          }}
        />
      ) : null}

      <Center>
        <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Actionsheet.Content>
            <Box w="100%" h={80}>
              <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular' }}>
                Symptoms
              </Text>
              <ScrollView>
                {dieaseObj.symptoms?.map((symptom, index) => (
                  <View
                    style={{ width: '100%', marginTop: 2, height: 40 }}
                    key={index}>
                    <Box
                      style={{
                        backgroundColor: '#e2e8f0',
                        padding: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          marginLeft: 5,
                        }}>
                        {symptom}
                      </Text>
                    </Box>
                  </View>
                ))}
              </ScrollView>

              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Regular' }}>
                  Predicted diease
                </Text>
                <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold' }}>
                  • {dieaseObj?.predictedDiease}
                </Text>
              </View>

              <View
                style={{
                  height: '30%',
                  justifyContent: 'flex-end',
                }}>
                <Button
                  onPress={() => navigation.navigate('Doctors', { dieaseObj })}
                  style={{ backgroundColor: '#002851' }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: 'white',
                    }}>
                    Search doctors
                  </Text>
                </Button>
              </View>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      </Center>
    </View>
  );
};

export default Searchbar;
