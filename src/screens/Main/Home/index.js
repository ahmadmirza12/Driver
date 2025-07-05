import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection}>
          <Image
            source={require('../../../assets/images/Roger.png')}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>John Doe</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.address}>18th Avenue</Text>
              <AntDesign name="down" size={14} color="#fff" style={{ marginLeft: 5 }} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
        </MapView>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#A0A0A0"
            style={styles.searchInput}
          />
          <AntDesign name="search1" size={18} color="#1F5546" />
        </View>

        {/* Reload Button */}
        <TouchableOpacity style={styles.reloadBtn}>
          <AntDesign name="reload1" size={16} color="#fff" />
        </TouchableOpacity>

        {/* Request Cards */}
        <View style={styles.cardOverlay}>
          <Text style={styles.upcomingTitle}>Upcoming Request</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardRow}
          >
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={19} color="#1F5546" />
                    <View style={{flexDirection:'column'}}>
                    <Text style={styles.labelText}>Pickup</Text>
                    <Text style={styles.valueText}>123 main st</Text>
                    </View>
                  </View>

                  <View style={styles.dotsLine} />
                  
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={19} color="#1F5546" />
                    <Text style={styles.labelText}>Drop Off</Text>
                  </View>
                  <Text style={styles.valueText}>123 main st</Text>
                </View>

                <Text style={styles.price}>$20</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Distance: 2.5 km</Text>
                <Text style={styles.metaText}>Time:10 min</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={19} color="#1F5546" />
                    <Text style={styles.labelText}>Pickup</Text>
                    <Text style={styles.valueText}>123 main st</Text>
                  </View>

                  <View style={styles.dotsLine} />
                  
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={19} color="#1F5546" />
                    <Text style={styles.labelText}>Drop Off</Text>
                  </View>
                  <Text style={styles.valueText}>123 main st</Text>
                </View>

                <Text style={styles.price}>$20</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Distance: 2.5 km</Text>
                <Text style={styles.metaText}>Time:10 min</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6F2',
  },
  header: {
    backgroundColor: '#1F5546',
    height: 100,
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  address: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchWrapper: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    zIndex: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
    color: '#000',
  },
  reloadBtn: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: '#1F5546',
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    zIndex: 4,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E8F6F2',
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    zIndex: 2,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
  },
  card: {
    width: 219,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    elevation: 3,
    justifyContent: 'space-between',
    marginBottom:5
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labelText: {
    fontSize: 8,
    color: '#9C9C9C',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 11,
    fontWeight: '#4D4D4D',
    color: '#4D4D4D',
    marginBottom: 2,
  },
  dotsLine: {
    borderLeftWidth: 1,
    borderColor: '#D3D3D3',
    height: 8,
    marginLeft: 6,
    marginVertical: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F5546',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 10,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent:'flex-end'
  },
  acceptBtn: {
    backgroundColor: '#1F5546',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  declineBtn: {
    backgroundColor: '#DADADA',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft:10
  },
  acceptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  declineText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});
