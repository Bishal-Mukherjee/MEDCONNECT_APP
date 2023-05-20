import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Box, Button, Input, Spinner, TextArea } from 'native-base';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import { Formik, useFormik } from 'formik';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { getuserdetails } from '../../../services/user';
import User from '../../../../assets/svg/user.svg';

const UserCard = ({ email }) => {
  return (
    <Box
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.700',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}
      style={{
        width: '95%',
        height: 100,
        margin: 10,
        elevation: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {email ? (
        <>
          <View>
            <User width={45} height={45} />
          </View>
          <View>
            <Text style={{ fontFamily: 'Poppins-Medium' }}>{email}</Text>
          </View>
        </>
      ) : (
        <Spinner size={30} color="#06b6d4" />
      )}
    </Box>
  );
};

const DetailsSection = () => {
  const [user, setUser] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [date, setDate] = useState();
  const [openDateTime, setOpenDateTime] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user.name,
      gender: user.gender,
      dob: user.dob,
      medicalHistory: user.medicalHistory,
    },
    onSubmit: () => {
      console.log({ ...formik.values, dob: date });
    },
  });

  const genderoptions = [
    { title: 'Male' },
    { title: 'Female' },
    { title: 'Other' },
  ];

  const handleGetUserDetails = async () => {
    try {
      setShowLoader(true);
      const response = await getuserdetails();
      setUser(response.user);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetUserDetails();
    }, []),
  );

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.700',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}
      style={{
        width: '95%',
        margin: 5,
        elevation: 5,
        display: 'flex',
        // flex: 1,
        padding: 10,
      }}>
      {showLoader ? (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
          }}>
          <Spinner size={30} color="#06b6d4" />
        </View>
      ) : (
        <View>
          <View>
            <Text style={{ fontFamily: 'Poppins-Medium' }}>
              Edit your details
            </Text>
          </View>

          <Formik onSubmit={formik.handleSubmit}>
            <View>
              <View style={{ marginTop: 10 }}>
                <Input
                  defaultValue={user.name}
                  placeholder="Edit name"
                  value={formik.values.name}
                  onChangeText={formik.handleChange('name')}
                  style={{ fontFamily: 'Poppins-Medium' }}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Pressable onPress={() => setOpenDateTime(true)}>
                  <Box
                    style={{
                      elevation: 3,
                      backgroundColor: '#e5e5e5',
                      borderRadius: 5,
                      width: '100%',
                      height: 40,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        padding: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                        color: 'black',
                      }}>
                      {date
                        ? dayjs(date).format('DD/MM/YYYY')
                        : dayjs(user.dob).format('DD/MM/YYYY')}
                    </Text>
                  </Box>
                </Pressable>

                <DatePicker
                  mode="date"
                  title={'Select Date of Birth'}
                  date={
                    user.dob?.length > 0
                      ? new Date(user.dob.split('T')[0])
                      : new Date()
                  }
                  onDateChange={setDate}
                  style={{ backgroundColor: 'none' }}
                  open={openDateTime}
                  onCancel={() => setOpenDateTime(false)}
                  onConfirm={d => {
                    setDate(d);
                    setOpenDateTime(false);
                  }}
                  modal
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <SelectDropdown
                  defaultValue={user.gender}
                  defaultButtonText={
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>
                      {user.gender ? user.gender : 'Select Gender'}
                    </Text>
                  }
                  data={genderoptions}
                  onSelect={formvalues =>
                    formik.setValues({
                      ...formik.values,
                      gender: formvalues.title,
                    })
                  }
                  renderDropdownIcon={isOpened => {
                    return (
                      <FontAwesomeIcon
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'black'}
                        size={18}
                      />
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <View key={index}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            margin: 5,
                          }}>
                          {item.title}
                        </Text>
                      </View>
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.title;
                  }}
                  buttonStyle={{
                    width: '100%',
                    borderRadius: 5,
                    //   borderColor: errors.role ? 'red' : '#979dac',
                    borderWidth: 0.5,
                  }}
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <TextArea
                  defaultValue={user.medicalHistory}
                  h={20}
                  placeholder="Add medical history (if any)"
                  onChangeText={formik.handleChange('medicalHistory')}
                  value={formik.values.medicalHistory}
                  style={{ width: '100%', fontFamily: 'Poppins-Medium' }}
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <Button
                  style={{ backgroundColor: '#002851' }}
                  onPress={formik.handleSubmit}>
                  Save
                </Button>
              </View>
            </View>
          </Formik>
        </View>
      )}
    </Box>
  );
};

const Profile = () => {
  const [user, setUser] = useState({});

  const handleGetUserDetails = async () => {
    try {
      const response = await getuserdetails();
      setUser(response.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetUserDetails();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <UserCard email={user.email} />
      <DetailsSection />
    </View>
  );
};

export default Profile;
