import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
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
  zIndex = 1002,
  zIndexInverse = 1002
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(multiple ? (Array.isArray(defaultValue) ? defaultValue : []) : defaultValue)
  const [dropdownItems, setDropdownItems] = useState(Array.isArray(items) ? items : [])

  const handleValueChange = (selectedValue) => {
    setValue(selectedValue)
    if (onSelectItem) {
      if (multiple) {
        // For multiple selections, map selected values to their items
        const selectedItems = dropdownItems.filter(item => selectedValue.includes(item.value))
        onSelectItem(selectedItems)
      } else {
        // For single selection, find the selected item
        const selectedItem = dropdownItems.find(item => item.value === selectedValue)
        onSelectItem(selectedItem || selectedValue)
      }
    }
  }

  // Get labels of selected items for multiple selection or single selection
  const getSelectedLabels = () => {
    if (!value) return [];
    if (multiple) {
      // Ensure value is an array before calling includes
      const valuesArray = Array.isArray(value) ? value : [value];
      return dropdownItems
        .filter(item => valuesArray.includes(item.value))
        .map(item => item.label);
    }
    const selected = dropdownItems.find(item => item.value === value);
    return selected ? [selected.label] : [];
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
        labelStyle={styles.labelStyle}
        listItemLabelStyle={styles.listItemLabelStyle}
        customItemLabelStyle={styles.customItemLabelStyle}
        customItemContainerStyle={styles.customItemContainerStyle}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />
      {value && (multiple || getSelectedLabels().length > 0) && (
        <View style={styles.selectedValuesContainer}>
          <Text style={styles.selectedValuesTitle}>Selected Operations</Text>
          {getSelectedLabels().map((label, index) => (
            <Text key={index} style={styles.selectedValueText}>
              {label}
            </Text>
          ))}
        </View>
      )}
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
    marginTop: 5,
  },
  labelStyle: {
    fontSize: 16,
    color: 'black',
  },
  listItemLabelStyle: {
    color: 'black',
  },
  customItemLabelStyle: {
    fontStyle: 'normal',
    fontWeight: '400',
  },
  customItemContainerStyle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  selectedValuesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  selectedValuesTitle: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '600',
    marginBottom: 5,
  },
  selectedValueText: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '400',
    marginVertical: 2,
  },
})