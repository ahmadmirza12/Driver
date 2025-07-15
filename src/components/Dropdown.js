import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'


const Dropdown = ({ 
  items = [],
  placeholder = "Select an option",
  onSelectItem = () => {},
  defaultValue = null,
  containerStyle = {},
  style = {},
  dropDownContainerStyle = {},
  textStyle = {},
  placeholderStyle = {},
  multiple = false,
  searchable = false,
  disabled = false,
  zIndex = 1000,
  zIndexInverse = 1000
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [dropdownItems, setDropdownItems] = useState(items)

  const handleValueChange = (selectedValue) => {
    setValue(selectedValue)
    if (onSelectItem) {
      const selectedItem = dropdownItems.find(item => item.value === selectedValue)
      onSelectItem(selectedItem || selectedValue)
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <DropDownPicker
        open={open}
        value={value}
        items={dropdownItems}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setDropdownItems}
        onChangeValue={handleValueChange}
        placeholder={placeholder}
        multiple={multiple}
        searchable={searchable}
        disabled={disabled}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        style={[styles.dropdown, style]}
        dropDownContainerStyle={[styles.dropDownContainer, dropDownContainerStyle]}
        textStyle={[styles.text, textStyle]}
        placeholderStyle={[styles.placeholderText, placeholderStyle]}
        selectedItemContainerStyle={styles.selectedItemContainer}
        selectedItemLabelStyle={styles.selectedItemLabel}
        itemSeparator={true}
        itemSeparatorStyle={styles.itemSeparator}
        searchContainerStyle={styles.searchContainer}
        searchTextInputStyle={styles.searchTextInput}
        activityIndicatorColor="#5A67D8"
        showArrowIcon={true}
        showTickIcon={true}
        arrowIconStyle={styles.arrowIcon}
        tickIconStyle={styles.tickIcon}
      />
    </View>
  )
}

export default Dropdown

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 5,
  },
  dropdown: {
    borderColor: "grey",
    borderWidth: .7,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    minHeight: 54,
    paddingHorizontal: 12,
  },
  dropDownContainer: {
    borderColor: "grey",
    borderWidth: .7,
    borderRadius: 8,
    backgroundColor: '#ffffff',
 
  },
  text: {
    fontSize: 16,
    color: "black",
    fontWeight: '400',
  },
  placeholderText: {
    fontSize: 16,
    color: "grey",
    fontWeight: '400',
  },
  selectedItemContainer: {
    backgroundColor: '#f7fafc',
  },
  selectedItemLabel: {
    color: '#2d3748',
    fontWeight: '500',
  },
  itemSeparator: {
    backgroundColor: '#e2e8f0',
    height: 1,
  },
  searchContainer: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchTextInput: {
    fontSize: 16,
    color: '#2d3748',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 6,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#718096',
  },
  tickIcon: {
    width: 20,
    height: 20,
    tintColor: '#48bb78',
  },
})
