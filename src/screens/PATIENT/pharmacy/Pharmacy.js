import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Modal,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  View,
  Text,
  Box,
  Button,
  Spinner,
  TextField,
  Center,
  Divider,
  Actionsheet,
} from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import uuid from 'react-native-uuid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '../../../context/context';
import { getActivePharmacy } from '../../../services/patient';
import { placeOrder } from '../../../services/pharmacy';
import { getorders } from '../../../services/user';
import DeliverySvg from '../../../../assets/svg/delivery.svg';
import PharmacyStoreSvg from '../../../../assets/svg/medical-store';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import dayjs from 'dayjs';

const OrderStatusDrawer = ({ openDrawer, orderDetails, setOrderDetails }) => {
  return (
    <Actionsheet isOpen={openDrawer} onClose={() => setOrderDetails({})}>
      <Actionsheet.Content w="100%" h={'lg'}>
        <Box
          style={{
            flex: 1,
            width: '100%',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: 10,
              justifyContent: 'center',
              alignContent: 'center',
              flex: 1,
            }}>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <View style={{ height: 350, width: '50%' }}>
                  <Box
                    style={{
                      width: '100%',
                      height: '100%',
                    }}>
                    {orderDetails.status.map((s, index) => (
                      <View key={index}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Center
                            size={3}
                            bgColor={'#023e8a'}
                            style={{ borderRadius: 100 }}
                          />
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {s.text}
                            </Text>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontFamily: 'Poppins-Regular',
                                fontSize: 13,
                              }}>
                              {dayjs(s.createdAt).format('hh:mm A')}
                            </Text>
                          </View>
                        </View>
                        {index !== 4 ? (
                          <Divider
                            orientation="vertical"
                            bgColor={'#023e8a'}
                            style={{
                              height: 30,
                              marginLeft: 5,
                            }}
                          />
                        ) : null}
                      </View>
                    ))}
                  </Box>
                </View>

                <View style={{ height: 350, width: '50%' }}>
                  <Box
                    style={{
                      width: '100%',
                      height: '100%',
                    }}>
                    <Button
                      style={{
                        margin: 1,
                        top: 0,
                      }}
                      disabled={true}
                      variant={'outline'}>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ marginRight: 5 }}>
                          <Octicons color="black" name="download" size={20} />
                        </View>
                        <View>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              color: 'black',
                            }}>
                            Medicine list
                          </Text>
                        </View>
                      </View>
                    </Button>
                  </Box>
                </View>
              </View>

              <Box style={{ height: 55 }}>
                {Boolean(orderDetails.deliveryInfo?.contactnumber?.length) ? (
                  <View style={{ margin: 5, marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>
                      Contact delivery person
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>
                      +91 {orderDetails.deliveryInfo?.contactnumber}
                    </Text>
                  </View>
                ) : null}
              </Box>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <Button
                  style={{
                    backgroundColor: '#023e8a',
                    width: '50%',
                    margin: 1,
                  }}
                  disabled={true}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ marginRight: 5 }}>
                      <Octicons color="white" name="download" size={20} />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: 'white',
                        }}>
                        Download Invoice
                      </Text>
                    </View>
                  </View>
                </Button>

                {orderDetails.paymentStatus ? (
                  <View
                    style={{
                      backgroundColor: '#67b99a',
                      width: '50%',
                      margin: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <View style={{ marginRight: 2 }}>
                        <MaterialIcons
                          color="white"
                          name="check-circle-outline"
                          size={20}
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          Payment Successful
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <Button
                    style={{
                      backgroundColor: '#023e8a',
                      width: '50%',
                      margin: 1,
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: 'white',
                          }}>
                          Pay Online
                        </Text>
                      </View>
                    </View>
                  </Button>
                )}
              </View>
            </View>
          </View>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const OrderCard = ({ order, handleOrderSelection }) => {
  return (
    <Pressable onPress={() => handleOrderSelection(order)}>
      <View
        style={{
          width: '100%',
          height: 120,
          backgroundColor: '#c2dfe3',
          borderRadius: 15,
          elevation: 5,
          margin: 1,
          marginTop: 10,
        }}>
        <Box>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
              height: '90%',
            }}>
            <View style={{ margin: 10, marginTop: 30 }}>
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <Center
                  size={'lg'}
                  bgColor="white"
                  style={{ borderRadius: 15 }}>
                  <DeliverySvg width="65%" />
                </Center>
              </View>
            </View>
            <View style={{ margin: 10, marginTop: 30, width: '60%' }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Medicines
                </Text>

                {order.billAmount ? (
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Poppins-Regular',
                      marginLeft: 'auto',
                    }}>
                    <FontAwesome name="rupee" size={15} /> {order.billAmount}
                  </Text>
                ) : null}
              </View>

              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {order.store.storeName}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Ordered on {dayjs(order.createdAt).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
          </View>
        </Box>
      </View>
    </Pressable>
  );
};

const OrderPlaceActionDrawer = ({ open, setOpen, pharmacy }) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    phonenumber: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Invalid phone number')
      .required('Please enter phone number'),
    address: yup.string().required(),
    pincode: yup
      .string()
      .matches(/^\d{6}$/, 'Invalid pincode')
      .required(),
  });

  const windowHeight = Dimensions.get('window').height;
  const { user } = useNavigation();
  const [file, setFile] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [showMessage, setShowMessage] = useState({
    type: '',
    text: '',
  });

  async function requestExternalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'App External Storage Permission',
          message: 'App needs access to your external storage to read files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read external storage');
      } else {
        console.log('External storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const handlePickFile = async () => {
    try {
      await requestExternalStoragePermission();
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      setFile({
        name: result.name,
        size: result.size,
        uri: result.fileCopyUri.replace('file://', ''),
      });
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

  const handlePlaceOrder = async ({ name, address, phonenumber, pincode }) => {
    try {
      const orderId = uuid.v4();
      const reference = storage().ref('/orders/' + orderId);
      const response = reference.putFile(file.uri.replace('file://', ''));
      setShowLoader(true);
      if ((await response).state === 'success') {
        const expiration = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days expiration
        const url = await response.snapshot.ref.getDownloadURL(expiration);

        const requestObj = {
          orderId,
          store: pharmacy,
          buyer: {
            name: { name, address, pincode, phonenumber, email: user.email },
          },
          doclink: url,
        };

        const respone = await placeOrder(requestObj);

        setShowLoader(false);
        setShowMessage(respone.success);
        setTimeout(() => {
          setOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false);
      setShowMessage({
        type: 'error',
        text: 'Something went wrong! Please try again',
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowMessage({
        type: '',
        text: '',
      });
    }, 3000);
  }, [showMessage]);

  return (
    <View>
      <Modal transparent={true} visible={open}>
        <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
          <View
            style={{
              flex: 0,
              width: '100%',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => setOpen(false)}>
              <MaterialIcons name="close" size={20} />
            </TouchableOpacity>
          </View>
          <Box w="100%" px={4} justifyContent="center">
            {Boolean(showMessage.type) ? (
              <View>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 30,
                    backgroundColor:
                      showMessage.type === 'success' ? '#0ead69' : '#e5383b',
                    justifyContent: 'space-between',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {showMessage.type === 'success' ? (
                      <MaterialIcons name="check" size={20} />
                    ) : (
                      <MaterialIcons name="close" size={20} />
                    )}
                    <Text style={{ color: 'white' }}>{showMessage.text}</Text>
                  </View>
                </Box>
              </View>
            ) : null}

            <Formik
              initialValues={{
                name: user.name,
                phonenumber: '9064437283',
                address: '',
                pincode: '',
              }}
              validationSchema={validationSchema}
              onSubmit={formvalues => handlePlaceOrder(formvalues)}>
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>Name</Text>
                    <TextField
                      placeholder="Enter name"
                      style={{ fontFamily: 'Poppins-Regular' }}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      isInvalid={Boolean(errors.name)}
                    />
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>
                      Phone number
                    </Text>
                    <TextField
                      placeholder="Enter phone number"
                      style={{ fontFamily: 'Poppins-Regular' }}
                      onChangeText={handleChange('phonenumber')}
                      onBlur={handleBlur('phonenumber')}
                      value={values.phonenumber}
                      isInvalid={Boolean(errors.phonenumber)}
                    />
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>
                      Area, Street, Village
                    </Text>
                    <TextField
                      placeholder="Enter delivery address"
                      style={{ fontFamily: 'Poppins-Regular' }}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      value={values.address}
                      isInvalid={Boolean(errors.address)}
                    />
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Regular' }}>
                      Pincode
                    </Text>
                    <TextField
                      placeholder="Enter pincode"
                      style={{ fontFamily: 'Poppins-Regular' }}
                      onChangeText={handleChange('pincode')}
                      onBlur={handleBlur('pincode')}
                      value={values.pincode}
                      isInvalid={Boolean(errors.pincode)}
                    />
                  </View>

                  <View>
                    {Object.keys(file).length ? (
                      <View>
                        <View>
                          <Box
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              height: 30,
                              backgroundColor: '#bfd7ea',
                              justifyContent: 'space-between',
                              padding: 5,
                              borderRadius: 5,
                            }}>
                            <View
                              style={{ display: 'flex', flexDirection: 'row' }}>
                              <MaterialIcons
                                name="insert-drive-file"
                                size={20}
                              />
                              <Text>{file.name}</Text>
                            </View>
                          </Box>
                        </View>
                        <View>
                          <Button
                            style={{
                              backgroundColor: '#002851',
                              width: '100%',
                              marginTop: 10,
                            }}
                            onPress={() => handleSubmit()}
                            isLoading={showLoader}>
                            <Text
                              style={{
                                fontFamily: 'Poppins-Regular',
                                color: 'white',
                              }}>
                              Place order
                            </Text>
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Button
                          style={{ backgroundColor: '#002851', width: '100%' }}
                          onPress={() => handlePickFile()}>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View style={{ marginRight: 10 }}>
                              <Octicons color="white" name="upload" size={20} />
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'white',
                                }}>
                                Upload medicines list / Prescription
                              </Text>
                            </View>
                          </View>
                        </Button>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </Formik>
          </Box>
        </View>
      </Modal>
    </View>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      orderId: '797270d0-f630-4058-92e3-b1ff3b3c1c3c',
      store: {
        storeName: 'Healthwise Pharmacy',
        storeId: '0fc05d59-6efb-4a0a-8293-0ae97f91bb41',
      },
      status: [
        { text: 'PENDING' },
        { text: 'CONFIRMED', createdAt: '2023-05-12T04:23:24.458Z' },
        { text: 'IN PROGRESS', createdAt: '2023-05-12T04:25:08.584Z' },
        { text: 'OUT FOR DELIVERY', createdAt: '2023-05-12T04:25:08.584Z' },
        { text: 'DELIVERED', createdAt: '2023-05-12T04:25:08.584Z' },
      ],
      buyer: {
        name: {
          name: 'Jenny Martin',
          address: 'Near Dreamland Hospital ',
          pincode: '713101',
          phonenumber: '9064437283',
          email: 'jenny@mail.com',
        },
      },
      doclink:
        'https://firebasestorage.googleapis.com/v0/b/medconnect-732fc.appspot.com/o/orders%2F797270d0-f630-4058-92e3-b1ff3b3c1c3c?alt=media&token=9596c907-44d9-42b4-b5a6-35ee58bca82d',
      createdAt: '2023-05-09T07:10:25.976Z',
      billAmount: 100,
      deliveryInfo: {
        contactnumber: '123456789',
      },
      paymentStatus: true,
    },
    {
      orderId: '797270d0-f630-4058-92e3-b1ff3b3c1c3c',
      store: {
        storeName: 'Vital Care Pharmacy',
        storeId: '0fc05d59-6efb-4a0a-8293-0ae97f91bb41',
      },
      status: [
        { text: 'PENDING' },
        { text: 'CONFIRMED', createdAt: '2023-05-12T04:23:24.458Z' },
        { text: 'IN PROGRESS', createdAt: '2023-05-12T04:25:08.584Z' },
        { text: 'OUT FOR DELIVERY', createdAt: '2023-05-12T04:25:08.584Z' },
      ],
      buyer: {
        name: {
          name: 'Jenny Martin',
          address: 'Near Dreamland Hospital ',
          pincode: '713101',
          phonenumber: '9064437283',
          email: 'jenny@mail.com',
        },
      },
      doclink:
        'https://firebasestorage.googleapis.com/v0/b/medconnect-732fc.appspot.com/o/orders%2F797270d0-f630-4058-92e3-b1ff3b3c1c3c?alt=media&token=9596c907-44d9-42b4-b5a6-35ee58bca82d',
      createdAt: '2023-05-11T07:10:25.976Z',
      billAmount: 500,
      deliveryinfo: {
        contactnumber: '123456789',
      },
      paymentStatus: false,
    },
  ]);
  const [message, setMessage] = useState({});
  const [loader, setLoader] = useState(false);
  const [orderDetails, setOrderDetails] = useState(false);
  const openDrawer = Boolean(Object.keys(orderDetails).length);

  const handleGetOrders = async () => {
    try {
      setLoader(true);
      const response = await getorders();
      if (response.error) {
        setLoader(false);
        setMessage({
          type: 'error',
          text: 'Error! Unable to fetch orders',
        });
      } else {
        setLoader(false);
        setOrders(response.orders);
      }
    } catch (err) {
      setLoader(false);
      console.log(err);
      setMessage({
        type: 'error',
        text: 'Error! Unable to fetch orders',
      });
    }
  };

  const handleOrderSelection = tempOrder => {
    try {
      setOrderDetails(tempOrder);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // handleGetOrders();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {loader ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size={25} color="#3399ff" />
        </View>
      ) : (
        <>
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
              {orders.map((order, index) => (
                <View key={index}>
                  <OrderCard
                    order={order}
                    handleOrderSelection={handleOrderSelection}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ flex: 1 }}>
            {openDrawer ? (
              <OrderStatusDrawer
                openDrawer={openDrawer}
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
              />
            ) : null}
          </View>
        </>
      )}
    </View>
  );
};

const MedicalStores = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState({});
  const [loader, setLoader] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleGetActivePharmacy = async () => {
    try {
      setLoader(true);
      const response = await getActivePharmacy();
      setPharmacies(response.stores);
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyMedicine = ({ tempPharmacy }) => {
    try {
      setSelectedPharmacy(tempPharmacy);
      setOpenConfirmation(true);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetActivePharmacy();
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {loader ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size={25} color="#3399ff" />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.container}>
            {pharmacies?.map((pharmacy, index) => (
              <View key={index} style={[styles.box]}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: 1,
                  }}>
                  <PharmacyStoreSvg width={120} height={120} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      textAlign: 'center',
                    }}>
                    {pharmacy.storeName}
                  </Text>
                </View>
                <View style={{ margin: 10, marginTop: 15 }}>
                  <Button
                    style={{ backgroundColor: '#002851', borderRadius: 15 }}
                    onPress={() =>
                      handleBuyMedicine({
                        tempPharmacy: {
                          storeName: pharmacy.storeName,
                          storeId: pharmacy.storeId,
                        },
                      })
                    }>
                    <Text
                      style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>
                      Buy medicine
                    </Text>
                  </Button>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
      {openConfirmation ? (
        <OrderPlaceActionDrawer
          open={openConfirmation}
          setOpen={setOpenConfirmation}
          pharmacy={selectedPharmacy}
        />
      ) : null}
    </View>
  );
};

const Pharmacy = () => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  const navigationbuttons = [
    { title: 'Stores', screenIndex: 0 },
    { title: 'Orders', screenIndex: 1 },
  ];

  const handleNavigation = tempScreenIndex => {
    try {
      setCurrentScreenIndex(tempScreenIndex);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 5,
          }}>
          {navigationbuttons.map((button, index) => (
            <View key={index} style={{ width: '49%', margin: 1 }}>
              <Button
                style={{
                  ...(currentScreenIndex === index
                    ? styles.activebutton
                    : styles.inactivebutton),
                }}
                onPress={() => handleNavigation(index)}>
                <Text
                  style={{
                    ...(currentScreenIndex === index
                      ? styles.activetext
                      : styles.inactivetext),
                  }}>
                  {button.title}
                </Text>
              </Button>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, margin: 5 }}>
          {currentScreenIndex ? (
            <>
              <Orders />
            </>
          ) : (
            <>
              <MedicalStores />
            </>
          )}
        </View>
      </View>
    </>
  );
};

export default Pharmacy;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 1,
    flex: 1,
  },
  box: {
    width: '49%',
    height: 210,
    margin: 1.5,
    backgroundColor: '#a1c6ea',
    borderRadius: 10,
    marginTop: 2.5,
  },
  activebutton: {
    backgroundColor: '#cce6ff',
  },
  activetext: {
    color: '#1a66ff',
    fontFamily: 'Poppins-Regular',
    fontWeight: 700,
  },
  inactivebutton: {
    backgroundColor: '#e5e5e5',
  },
  inactivetext: {
    color: '#d4d4d4',
    fontFamily: 'Poppins-Regular',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: '#9999a1',
    borderWidth: 1,
  },
});
