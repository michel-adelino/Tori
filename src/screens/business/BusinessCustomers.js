import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { FontFamily, Color } from '../../styles/GlobalStyles';
import firestore from '@react-native-firebase/firestore';

const getDayName = (dateString) => {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const BusinessCustomers = ({ navigation, route }) => {
  const { businessId } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all appointments for this business
      const appointmentsQuery = firestore().collection('appointments').where('businessId', '==', businessId);
      const appointmentsSnap = await appointmentsQuery.get();
      const appointments = appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get unique customer IDs
      const customerIds = [...new Set(appointments.map(app => app.customerId))];

      // Fetch customer details
      const customersData = [];
      for (const customerId of customerIds) {
        const customerQuery = firestore().collection('users').where('id', '==', customerId);
        const customerSnap = await customerQuery.get();
        if (!customerSnap.empty) {
          const customerData = customerSnap.docs[0].data();
          
          // Calculate customer statistics
          const customerAppointments = appointments.filter(app => app.customerId === customerId);
          const totalVisits = customerAppointments.filter(app => app.status === 'completed').length;
          const totalSpent = customerAppointments
            .filter(app => app.status === 'completed')
            .reduce((sum, app) => sum + (app.price || 0), 0);
          const canceledAppointments = customerAppointments.filter(app => app.status === 'canceled').length;
          const lastVisit = customerAppointments
            .filter(app => app.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date || null;

          customersData.push({
            id: customerId,
            name: customerData.name || 'לקוח לא ידוע',
            phone: customerData.phone || '',
            email: customerData.email || '',
            totalVisits,
            totalSpent,
            lastVisit,
            canceledAppointments
          });
        }
      }

      // Sort customers by total spent (highest first)
      customersData.sort((a, b) => b.totalSpent - a.totalSpent);
      
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    Linking.openURL(`whatsapp://send?phone=972${phone.substring(1)}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderCustomerCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => navigation.navigate('CustomerDetails', { customer: item })}
    >
      <View style={styles.customerHeader}>
        <View style={styles.contactButtons}>
          <TouchableOpacity 
            style={[styles.contactButton, styles.whatsappButton]}
            onPress={() => handleWhatsApp(item.phone)}
          >
            <FontAwesome5 name="whatsapp" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.contactButton, styles.phoneButton]}
            onPress={() => handleCall(item.phone)}
          >
            <FontAwesome5 name="phone" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.contactButton, styles.emailButton]}
            onPress={() => handleEmail(item.email)}
          >
            <FontAwesome5 name="envelope" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.customerName}>👤 {item.name}</Text>
          <Text style={styles.customerContact}>📱 {item.phone}</Text>
        </View>
      </View>

      <View style={styles.customerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₪{item.totalSpent}</Text>
          <Text style={styles.statLabel}>💰 סה"כ</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.dateContainer}>
            <Text style={styles.statValue}>{formatDate(item.lastVisit)}</Text>
            <Text style={styles.dayName}>יום {getDayName(item.lastVisit)}</Text>
          </View>
          <Text style={styles.statLabel}>🕒 ביקור אחרון</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statValue,
            item.canceledAppointments > 0 && styles.canceledValue
          ]}>
            {item.canceledAppointments}
          </Text>
          <Text style={styles.statLabel}>❌ ביטולים</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalVisits}</Text>
          <Text style={styles.statLabel}>✨ ביקורים</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="חיפוש לקוחות..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <Ionicons name="search" size={24} color={Color.primary} style={styles.searchIcon} />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Color.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Color.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👥 לקוחות</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color={Color.primary} />
        </TouchableOpacity>
      </View>

      {renderSearchBar()}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>סה"כ {filteredCustomers.length} לקוחות פעילים 🌟</Text>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.primary,
    fontFamily: FontFamily.primary,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryText: {
    fontSize: 14,
    color: Color.primary,
    fontFamily: FontFamily.primary,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontFamily: FontFamily.primary,
    textAlign: 'right',
    fontSize: 14,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    fontFamily: FontFamily.primary,
    textAlign: 'right',
  },
  customerContact: {
    fontSize: 14,
    color: '#4a5568',
    fontFamily: FontFamily.primary,
    textAlign: 'right',
    marginTop: 2,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  phoneButton: {
    backgroundColor: '#007AFF',
  },
  emailButton: {
    backgroundColor: '#FF5722',
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    fontFamily: FontFamily.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#4a5568',
    fontFamily: FontFamily.primary,
    marginTop: 2,
  },
  canceledValue: {
    color: '#ef4444',
  },
  dayName: {
    fontSize: 12,
    color: '#4a5568',
    fontFamily: FontFamily.primary,
  },
});

export default BusinessCustomers;
