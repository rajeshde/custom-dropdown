import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: 280,
    height: 40,
    backgroundColor: '#f5fcff',
    borderRadius: 6,
    borderColor: '#317137',
    borderWidth: 1,
  },
  dropdownItem: {
    width: '100%',
    height: 40,
    paddingLeft: 20,
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
  },
  extraSmallText: {
    fontSize: 12,
    color: '#4D4D4F',
  },
  mediumText: {
    fontSize: 18,
    color: '#4D4D4F',
  },
});

export default styles;
