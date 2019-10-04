import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Platform,
} from 'react-native';

import usePrevious from './usePrevious';
import styles from './styles';

import isEqual from 'lodash/isEqual';

const DropdownItem = ({value, label, onPressDropdownItem}) => {
  const onPress = () => onPressDropdownItem(value, label);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.dropdownItem}
      activeOpacity={1}>
      <Text style={styles.extraSmallText}>{label}</Text>
    </TouchableOpacity>
  );
};
const Dropdown = ({
  data,
  label = '',
  defaultValue,
  value,
  disabled,
  required,
  onPressItem,
  containerStyle,
  itemCount = 4,
}) => {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [coordinates, setConrdinates] = useState({top: 0, left: 0});
  const componentContainerStyle = useRef({});
  const buttonContainerStyle = useRef({});
  const prevValue = usePrevious(value);
  const containerHeight =
    (data.length < itemCount ? data.length : itemCount) * 40;

  useLayoutEffect(() => {
    Object.keys(containerStyle).forEach(key => {
      if (
        key === 'marginBottom' ||
        key === 'marginTop' ||
        key === 'marginVertical' ||
        key === 'paddingBottom' ||
        key === 'paddingTop' ||
        key === 'paddingVertical'
      ) {
        componentContainerStyle.current = {
          ...componentContainerStyle.current,
          [key]: containerStyle[key],
        };
      } else {
        buttonContainerStyle.current = {
          ...buttonContainerStyle.current,
          [key]: containerStyle[key],
        };
      }
    });
    componentContainerStyle.current = {
      ...componentContainerStyle.current,
      zIndex: 1,
    };
  }, []);

  useEffect(() => {
    if (defaultValue) {
      const defaultSelectedItem = getSelectedItem(value);
      const defaultValue = defaultSelectedItem[0].value;
      const defaultLabel = defaultSelectedItem[0].label;

      const seletedIndex = getSelectedIndex(defaultValue);

      onPressItem(defaultValue, seletedIndex);
      setSelectedLabel(defaultLabel);
    } else {
      setSelectedLabel(label);
    }
  }, [getSelectedItem]);

  useEffect(() => {
    if (prevValue !== value || defaultValue !== value) {
      if (value) {
        const defaultSelectedItem = getSelectedItem(value);
        setSelectedLabel(defaultSelectedItem[0].label);
      } else {
        setSelectedLabel(label);
      }
    }
  }, [value, getSelectedItem]);

  const getSelectedItem = useCallback(
    passedValue => data.filter(({value}) => isEqual(value, passedValue)),
    [value],
  );

  const handleResponder = event => {
    onPressDropDown();
    const {pageY: top, locationX: left} = event.nativeEvent;
    setConrdinates({top, left});
    console.log('touchable event', event);
  };
  const onPressDropDown = () => setIsDropdownOpened(!isDropdownOpened);

  const onPressClearSelectedItem = () => {
    setSelectedLabel(label);
    setIsDropdownOpened(false);
    onPressItem(null, -1);
  };
  const _keyExtractor = item => item.label;
  const onPressDropdownItem = (value, label) => {
    setSelectedLabel(label);
    setIsDropdownOpened(false);
    const seletedIndex = getSelectedIndex(value);
    onPressItem(value, seletedIndex);
  };
  const _renderDropdownItem = ({item}) => (
    <DropdownItem {...item} onPressDropdownItem={onPressDropdownItem} />
  );

  const getSelectedIndex = value => {
    let selectedIndex = 0;
    data.forEach((item, index) => {
      if (item.value === value) {
        selectedIndex = index;
      }
    });
    return selectedIndex;
  };

  let closeIcon = <Text onPress={onPressClearSelectedItem}>Clear</Text>;
  const rightIcon = <Text>{isDropdownOpened ? '^' : 'V'}</Text>;
  if (required) {
    closeIcon = null;
  }
  return (
    <View style={componentContainerStyle.current}>
      <View
        onStartShouldSetResponder={() => true}
        onResponderGrant={event => {
          // event.persist()
          handleResponder(event);
        }}
        // onPress={onPressDropDown}
        // disabled={disabled}
        style={[styles.dropdownButton, buttonContainerStyle.current]}>
        <Text style={styles.mediumText}>{selectedLabel}</Text>
        {selectedLabel === label ? rightIcon : disabled ? null : closeIcon}
      </View>
      {isDropdownOpened ? (
        <Modal
          transparent
          visible={isDropdownOpened}
          onRequestClose={onPressDropDown}>
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setIsDropdownOpened(false)}
            style={{flex: 1}}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  // position: 'absolute',
                  // top: buttonContainerStyle.current.height || styles.dropdownButton.height,
                  top: coordinates.top,
                  alignSelf: 'center',
                  height: containerHeight,
                  width:
                    buttonContainerStyle.current.width ||
                    styles.dropdownButton.width,
                  ...Platform.select({
                    ios: {
                      shadowOpacity: 0.6,
                      shadowRadius: 5,
                      shadowOffset: {width: 0, height: 5},
                      shadowColor: '#4D4D4F',
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                  borderRadius: 6,
                }}>
                <FlatList
                  data={data}
                  keyExtractor={_keyExtractor}
                  renderItem={_renderDropdownItem}
                />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      ) : null}
    </View>
  );
};

export default Dropdown;
