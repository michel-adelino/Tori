import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { FontFamily } from '../../styles/GlobalStyles';

export default function BusinessServicesSetup({ navigation, route }) {
  const { businessData } = route.params;
  const [services, setServices] = useState(businessData?.services || [
    { id: '1', name: 'תספורת', price: '80', duration: '30' },
    { id: '2', name: 'צבע', price: '200', duration: '60' },
  ]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30' });
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const durationOptions = ['15', '30', '45', '60'];

  const addService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      Alert.alert('שגיאה', 'נא למלא את כל השדות');
      return;
    }
    
    setServices([
      ...services,
      { ...newService, id: Date.now().toString() }
    ]);
    setNewService({ name: '', price: '', duration: '30' });
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter(service => service.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const handleEditService = (service) => {
    setEditingService({ ...service });
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id ? editingService : service
      ));
      setShowEditModal(false);
      setEditingService(null);
    }
  };

  const DurationGrid = ({ value, onChange, style }) => (
    <View style={[styles.durationGrid, style]}>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={[styles.durationButton, value === '15' && styles.durationButtonActive]}
          onPress={() => onChange('15')}
        >
          <Text style={[styles.durationButtonText, value === '15' && styles.durationButtonTextActive]}>15 דק'</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.durationButton, value === '30' && styles.durationButtonActive]}
          onPress={() => onChange('30')}
        >
          <Text style={[styles.durationButtonText, value === '30' && styles.durationButtonTextActive]}>30 דק'</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={[styles.durationButton, value === '45' && styles.durationButtonActive]}
          onPress={() => onChange('45')}
        >
          <Text style={[styles.durationButtonText, value === '45' && styles.durationButtonTextActive]}>45 דק'</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.durationButton, value === '60' && styles.durationButtonActive]}
          onPress={() => onChange('60')}
        >
          <Text style={[styles.durationButtonText, value === '60' && styles.durationButtonTextActive]}>60 דק'</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>➡️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✂️ ניהול שירותים</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ הוספת שירות חדש</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>🏷️ שם השירות</Text>
            <TextInput
              style={styles.input}
              value={newService.name}
              onChangeText={(text) => setNewService({ ...newService, name: text })}
              placeholder="לדוגמה: תספורת"
              textAlign="right"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>💰 מחיר</Text>
              <TextInput
                style={styles.input}
                value={newService.price}
                onChangeText={(text) => setNewService({ ...newService, price: text })}
                placeholder="₪"
                keyboardType="numeric"
                textAlign="right"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>⏱️ משך זמן</Text>
              <DurationGrid 
                value={newService.duration}
                onChange={(duration) => setNewService({ ...newService, duration })}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addService}>
            <Text style={styles.addButtonText}>➕ הוסף שירות</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 רשימת השירותים</Text>
          
          <View style={styles.servicesList}>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.serviceActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditService(service)}
                    >
                      <Text style={styles.editButtonText}>עריכה</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleDeleteService(service)}
                    >
                      <Text style={styles.removeButtonText}>הסרה</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceInfo}>💰 {service.price} ₪</Text>
                  <Text style={styles.serviceInfo}>⏱️ {service.duration} דק'</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>❌ מחיקת שירות</Text>
            <Text style={styles.modalText}>
              האם את/ה בטוח/ה שברצונך למחוק את השירות "{serviceToDelete?.name}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>מחק</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ עריכת שירות</Text>
            
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>שם השירות</Text>
              <TextInput
                style={styles.modalInput}
                value={editingService?.name}
                onChangeText={(text) => setEditingService({ ...editingService, name: text })}
                textAlign="right"
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>מחיר</Text>
              <TextInput
                style={styles.modalInput}
                value={editingService?.price}
                onChangeText={(text) => setEditingService({ ...editingService, price: text })}
                keyboardType="numeric"
                textAlign="right"
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>משך זמן</Text>
              <DurationGrid 
                value={editingService?.duration}
                onChange={(duration) => setEditingService({ ...editingService, duration })}
                style={{ marginTop: 8 }}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: '#2196F3' }]}
                onPress={confirmEdit}
              >
                <Text style={styles.confirmButtonText}>שמור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#2196F3',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#2196F3',
    marginBottom: 16,
    textAlign: 'right',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row-reverse', // RTL
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-SemiBold"],
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    backgroundColor: '#f8fafc',
  },
  durationGrid: {
    width: '100%',
    gap: 8,
  },
  durationRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  durationButtonText: {
    fontSize: 14,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#333',
  },
  durationButtonTextActive: {
    color: '#fff',
    fontFamily: FontFamily["Assistant-Bold"],
  },
  addButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  servicesList: {
    flexDirection: 'column-reverse', // RTL - newest items at top
  },
  serviceCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  serviceHeader: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#0369a1',
  },
  serviceActions: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  serviceDetails: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
  },
  serviceInfo: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#0369a1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#ef4444',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  modalInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-SemiBold"],
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    backgroundColor: '#f8fafc',
  },
});
