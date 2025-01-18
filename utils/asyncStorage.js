import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDataToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data: ", e);
  }
};

export const getDataFromStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.error("Error reading value: ", e);
  }
};
