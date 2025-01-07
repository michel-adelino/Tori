import * as React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  I18nManager
} from "react-native";
import { FontFamily, Color } from "../../styles/GlobalStyles";
import { Ionicons } from '@expo/vector-icons';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const CATEGORIES = [
  { id: '1', name: 'מספרות' },
  { id: '2', name: 'ספא' },
  { id: '3', name: 'ציפורניים' },
  { id: '4', name: 'קוסמטיקה' },
  { id: '5', name: 'איפור' },
  { id: '6', name: 'שיער' },
  { id: '7', name: 'טיפולי פנים' },
  { id: '8', name: 'טיפולי גוף' },
  { id: '9', name: 'הסרת שיער' },
  { id: '10', name: 'עיסוי' },
];

const BusinessSignupScreen = ({ navigation, route }) => {
  const [formData, setFormData] = React.useState({
    businessName: '',
    ownerName: '',
    ownerPhone: '',
    businessPhone: '',
    email: '',
    address: '',
    selectedCategories: [], 
  });

  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const openCategoryPicker = () => {
    setTempSelectedCategories([...formData.selectedCategories]);
    setShowCategoryPicker(true);
  };

  const closeCategoryPicker = () => {
    setShowCategoryPicker(false);
    setTempSelectedCategories([]);
  };

  const handleCategoryToggle = (categoryName) => {
    setTempSelectedCategories(prev => {
      const currentCategories = [...prev];
      const categoryIndex = currentCategories.indexOf(categoryName);
      
      if (categoryIndex >= 0) {
        currentCategories.splice(categoryIndex, 1);
      } else {
        currentCategories.push(categoryName);
      }

      return currentCategories;
    });
  };

  const handleDoneCategories = () => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: tempSelectedCategories
    }));
    
    // נקה את השגיאה אם נבחרה לפחות קטגוריה אחת
    if (errors.categories && tempSelectedCategories.length > 0) {
      setErrors(prev => ({
        ...prev,
        categories: null
      }));
    }
    
    setShowCategoryPicker(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^05\d{8}$/;

    // בדיקת שם העסק
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'שם העסק הוא שדה חובה';
    }

    // בדיקת שם בעל העסק
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'שם בעל העסק הוא שדה חובה';
    }

    // בדיקת טלפון בעל העסק
    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = 'מספר טלפון בעל העסק הוא שדה חובה';
    } else if (!phoneRegex.test(formData.ownerPhone)) {
      newErrors.ownerPhone = 'מספר טלפון לא תקין';
    }

    // בדיקת טלפון העסק
    if (!formData.businessPhone.trim()) {
      newErrors.businessPhone = 'מספר טלפון העסק הוא שדה חובה';
    } else if (!phoneRegex.test(formData.businessPhone)) {
      newErrors.businessPhone = 'מספר טלפון לא תקין';
    }

    // בדיקת אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל היא שדה חובה';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    // בדיקת כתובת
    if (!formData.address.trim()) {
      newErrors.address = 'כתובת העסק היא שדה חובה';
    }

    // בדיקת קטגוריות
    if (formData.selectedCategories.length === 0) {
      newErrors.categories = 'יש לבחור לפחות קטגוריה אחת';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // נקה את השגיאה כשהמשתמש מתחיל להקליד
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // יצירת אובייקט עם נתוני ברירת מחדל נוספים
        const businessDataToSend = {
          ...formData,
          customers: [],
          appointments: [],
          services: [],
          stats: {
            totalCustomers: 0,
            totalAppointments: 0,
            totalRevenue: 0
          }
        };
        
        navigation.replace('BusinessDashboard', { businessData: businessDataToSend });
      } catch (error) {
        setErrors({ submit: 'אירעה שגיאה בשמירת הנתונים' });
      }
      setIsSubmitting(false);
    }
  };

  const handleSkipWithDemo = () => {
    const demoData = {
      businessName: "עסק לדוגמה",
      ownerName: "בעל העסק לדוגמה",
      ownerPhone: "0501234567",
      businessPhone: "0501234567",
      email: "demo@example.com",
      address: "כתובת לדוגמה",
      selectedCategories: ['מספרות'] 
    };

    setFormData(demoData);

    // Navigate to the next screen with demo data
    navigation.navigate('BusinessDashboard', {
      businessData: {
        ...demoData,
        customers: [],
        appointments: [],
        services: [],
        stats: {
          totalCustomers: 0,
          totalAppointments: 0,
          totalRevenue: 0
        }
      }
    });
  };

  const renderError = (field) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>✨ הצטרפות לתורי</Text>
            <Text style={styles.headerSubtitle}>נשמח לעזור לך לנהל את העסק שלך! 🎯</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>🏢 פרטי העסק</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>שם העסק</Text>
              <TextInput
                style={[styles.input, errors.businessName && styles.inputError]}
                value={formData.businessName}
                onChangeText={(text) => handleInputChange('businessName', text)}
                placeholder="הכנס את שם העסק שלך"
                placeholderTextColor="#9ca3af"
              />
              {renderError('businessName')}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>👤 שם בעל העסק</Text>
              <TextInput
                style={[styles.input, errors.ownerName && styles.inputError]}
                value={formData.ownerName}
                onChangeText={(text) => handleInputChange('ownerName', text)}
                placeholder="הכנס את שמך המלא"
                placeholderTextColor="#9ca3af"
              />
              {renderError('ownerName')}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>📱 טלפון בעל העסק</Text>
              <TextInput
                style={[styles.input, errors.ownerPhone && styles.inputError]}
                value={formData.ownerPhone}
                onChangeText={(text) => handleInputChange('ownerPhone', text)}
                placeholder="05X-XXXXXXX"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
              {renderError('ownerPhone')}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>☎️ טלפון העסק</Text>
              <TextInput
                style={[styles.input, errors.businessPhone && styles.inputError]}
                value={formData.businessPhone}
                onChangeText={(text) => handleInputChange('businessPhone', text)}
                placeholder="05X-XXXXXXX"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
              {renderError('businessPhone')}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>📧 אימייל</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
              />
              {renderError('email')}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>📍 כתובת העסק</Text>
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder="הכנס את כתובת העסק המלאה"
                placeholderTextColor="#9ca3af"
              />
              {renderError('address')}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>🏷️ קטגוריות</Text>
              <TouchableOpacity
                style={[styles.categoryButton, errors.categories && styles.inputError]}
                onPress={openCategoryPicker}
              >
                <Text style={styles.categoryButtonText}>
                  {formData.selectedCategories.length > 0
                    ? formData.selectedCategories.join(', ')
                    : 'בחר קטגוריות'}
                </Text>
              </TouchableOpacity>
              {renderError('categories')}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '⏳ מתחברים...' : '🚀 יוצאים לדרך!'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipWithDemo}
          >
            <Text style={styles.skipButtonText}>דלג עם נתוני דוגמה ⚡️</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryPicker}
        onRequestClose={closeCategoryPicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🏷️ בחר קטגוריות</Text>
            <ScrollView style={styles.categoriesList}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    tempSelectedCategories.includes(category.name) && styles.categoryItemSelected
                  ]}
                  onPress={() => handleCategoryToggle(category.name)}
                >
                  <Text style={[
                    styles.categoryItemText,
                    tempSelectedCategories.includes(category.name) && styles.categoryItemTextSelected
                  ]}>
                    {category.name}
                  </Text>
                  {tempSelectedCategories.includes(category.name) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleDoneCategories}>
                <Text style={styles.modalButtonText}>✅ סיום</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={closeCategoryPicker}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>❌ ביטול</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#2196F3',
    marginBottom: 8,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#64748b',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'flex-end',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#1e293b',
    marginBottom: 16,
    width: '100%',
    textAlign: 'right',
  },
  label: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-SemiBold"],
    color: '#475569',
    marginBottom: 8,
    width: '100%',
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#1e293b',
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    height: 48,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: FontFamily["Assistant-Regular"],
    marginTop: 4,
    width: '100%',
    textAlign: 'right',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  categoryButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    width: '100%',
    height: 48,
  },
  categoryButtonText: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#1e293b',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    marginHorizontal: 16,
  },
  skipButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    direction: 'rtl',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: FontFamily["Assistant-Bold"],
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 16,
    writingDirection: 'rtl',
  },
  categoriesList: {
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  categoryItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  categoryItemText: {
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Regular"],
    color: '#475569',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  categoryItemTextSelected: {
    color: '#2196F3',
    fontFamily: FontFamily["Assistant-SemiBold"],
  },
  checkmark: {
    color: '#2196F3',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalButtonCancel: {
    backgroundColor: '#f1f5f9',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamily["Assistant-Bold"],
  },
  modalButtonTextCancel: {
    color: '#64748b',
  },
});

export default BusinessSignupScreen;
