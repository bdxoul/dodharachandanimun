import { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Mail, 
  User, 
  Building2, 
  Shield, 
  Facebook,
  Globe,
  Menu,
  X,
  RefreshCw,
  Edit3,
  Save,
  AlertCircle,
  CheckCircle,
  Lock,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Default password - can be changed through the UI
const DEFAULT_PASSWORD = 'Colddrink123@';
const PASSWORD_STORAGE_KEY = 'dcm_admin_password';

// Default data (will be used if no localStorage data exists)
const defaultMunicipalityData = {
  name: "Dodhara Chandani Municipality",
  nepaliName: "दोधारा चादँनी नगरपालिका",
  district: "Kanchanpur",
  province: "Sudurpashchim Province",
  country: "Nepal",
  established: "18 May 2014",
  area: "56.84 km²",
  population: "39,253 (2011 census)",
  wards: 10,
  phone: "099-400184",
  tollFree: "18105000037",
  email: "dcmun1015@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=100010201968230"
};

const defaultKeyOfficials = {
  mayor: {
    name: "Kishor Kumar Limbu",
    nepaliName: "किशोर कुमार लिम्बु",
    title: "Mayor",
    nepaliTitle: "नगर प्रमुख",
    phone: "9865575277",
    email: "dcmunmayor1@gmail.com",
    party: "CPN (UML)"
  },
  deputyMayor: {
    name: "Ganga Devi Joshi",
    nepaliName: "गंगा देवी जोशी",
    title: "Deputy Mayor",
    nepaliTitle: "नगर उप प्रमुख",
    phone: "9806460542",
    email: "deputymayor77@gmail.com",
    party: "Nepali Congress"
  }
};

const defaultAdministrativeStaff = [
  {
    name: "Ganesh Datt Mishra",
    nepaliName: "गणेश दत्त मिश्र",
    position: "Chief Administrative Officer",
    nepaliPosition: "प्रमुख प्रशासकीय अधिकृत",
    phone: "9858728111"
  },
  {
    name: "Suresh Singh Saud",
    nepaliName: "सुरेश सिंह साउँद",
    position: "IT Officer / Information Officer",
    nepaliPosition: "सूचना प्रविधि अधिकृत / सुचना अधिकारी",
    phone: "9843290586"
  }
];

const defaultWardChairpersons = [
  { ward: 1, name: "Vikram Chand", nepaliName: "विक्रम चन्द", phone: "9749903999", email: "dcmunwordno1@gmail.com" },
  { ward: 2, name: "Padam Singh Rawal", nepaliName: "पदम सिंह रावल", phone: "9865949589", email: "dcmunwordno2@gmail.com" },
  { ward: 3, name: "Hari Singh Dhanadi", nepaliName: "हरि सिंह धनाडी", phone: "9809416102", email: "dcmunwordno3@gmail.com", note: "Municipal Spokesperson" },
  { ward: 4, name: "Bhakta Bahadur Sunar", nepaliName: "भक्त बहादुर सुनार", phone: "9865947469", email: "dcmunwordno4@gmail.com" },
  { ward: 5, name: "Keshav Bahadur Khatri", nepaliName: "केशव बहादुर खत्री", phone: "9848103995", email: "dcmunwordno5@gmail.com" },
  { ward: 6, name: "Om Bahadur Basnet", nepaliName: "ओम बहादुर बस्नेत", phone: "9848738616", email: "dcmunwordno6@gmail.com" },
  { ward: 7, name: "Gyanendra Bahadur Bahek Kshetri", nepaliName: "ज्ञानेन्द्र बहादुर बहेक क्षेत्री", phone: "9809476588", email: "dcmunwordno7@gmail.com" },
  { ward: 8, name: "Omprakash Rokaya", nepaliName: "ओमप्रकाश रोकाया", phone: "9809497059", email: "dcmunwordno8@gmail.com" },
  { ward: 9, name: "Gopilal Kadel", nepaliName: "गोपीलाल कडेल", phone: "9806495888", email: "dcmunwordno9@gmail.com" },
  { ward: 10, name: "Chandra Bahadur Singh", nepaliName: "चन्द्र बहादुर सिंह", phone: "9810655112", email: "dcmunwordno10@gmail.com" }
];

const defaultEmergencyContacts = [
  {
    service: "Area Police Office",
    nepaliService: "इलाका प्रहरी कार्यालय",
    location: "Dodhara Chandani",
    phone: "9858790406"
  },
  {
    service: "District Police Office",
    nepaliService: "जिल्ला प्रहरी कार्यालय",
    location: "Kanchanpur",
    phone: "9858790402"
  },
  {
    service: "Toll Free Number",
    nepaliService: "टोल फ्रि नम्बर",
    location: "Municipality",
    phone: "18105000037"
  }
];

// Storage keys
const STORAGE_KEYS = {
  municipality: 'dcm_municipality_data',
  officials: 'dcm_officials_data',
  staff: 'dcm_staff_data',
  wards: 'dcm_wards_data',
  emergency: 'dcm_emergency_data',
  lastUpdate: 'dcm_last_update'
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Password states
  const [adminPassword, setAdminPassword] = useState<string>(DEFAULT_PASSWORD);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Data states
  const [municipalityData, setMunicipalityData] = useState(defaultMunicipalityData);
  const [keyOfficials, setKeyOfficials] = useState(defaultKeyOfficials);
  const [administrativeStaff, setAdministrativeStaff] = useState(defaultAdministrativeStaff);
  const [wardChairpersons, setWardChairpersons] = useState(defaultWardChairpersons);
  const [emergencyContacts, setEmergencyContacts] = useState(defaultEmergencyContacts);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedMunicipality = localStorage.getItem(STORAGE_KEYS.municipality);
        const savedOfficials = localStorage.getItem(STORAGE_KEYS.officials);
        const savedStaff = localStorage.getItem(STORAGE_KEYS.staff);
        const savedWards = localStorage.getItem(STORAGE_KEYS.wards);
        const savedEmergency = localStorage.getItem(STORAGE_KEYS.emergency);
        const savedLastUpdate = localStorage.getItem(STORAGE_KEYS.lastUpdate);
        const savedPassword = localStorage.getItem(PASSWORD_STORAGE_KEY);

        if (savedMunicipality) setMunicipalityData(JSON.parse(savedMunicipality));
        if (savedOfficials) setKeyOfficials(JSON.parse(savedOfficials));
        if (savedStaff) setAdministrativeStaff(JSON.parse(savedStaff));
        if (savedWards) setWardChairpersons(JSON.parse(savedWards));
        if (savedEmergency) setEmergencyContacts(JSON.parse(savedEmergency));
        if (savedLastUpdate) setLastUpdate(savedLastUpdate);
        if (savedPassword) setAdminPassword(savedPassword);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage
  const saveData = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.municipality, JSON.stringify(municipalityData));
      localStorage.setItem(STORAGE_KEYS.officials, JSON.stringify(keyOfficials));
      localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(administrativeStaff));
      localStorage.setItem(STORAGE_KEYS.wards, JSON.stringify(wardChairpersons));
      localStorage.setItem(STORAGE_KEYS.emergency, JSON.stringify(emergencyContacts));
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.lastUpdate, now);
      setLastUpdate(now);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Password verification
  const verifyPassword = () => {
    if (enteredPassword === adminPassword) {
      setPasswordError('');
      setShowPasswordDialog(false);
      setEnteredPassword('');
      setEditMode(true);
      setShowUpdateDialog(false);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  // Change password
  const changePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setAdminPassword(newPassword);
    localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
    setPasswordSuccess('Password changed successfully!');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setShowChangePasswordDialog(false);
      setPasswordSuccess('');
    }, 2000);
  };

  // Check for updates from official website
  const checkForUpdates = async () => {
    setUpdateStatus('checking');
    setUpdateMessage('Checking for updates from official website...');
    
    try {
      await fetch('https://dodharachandanimun.gov.np/', {
        method: 'GET',
        mode: 'no-cors'
      });
      
      setUpdateStatus('success');
      setUpdateMessage('Website is accessible. Note: Due to browser security, automatic data extraction may be limited. You can manually update the information using the Edit button.');
    } catch (error) {
      setUpdateStatus('error');
      setUpdateMessage('Could not connect to the official website. This is normal due to security restrictions. You can manually update the data using the Edit button.');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Edit handlers
  const updateMayor = (field: string, value: string) => {
    setKeyOfficials(prev => ({
      ...prev,
      mayor: { ...prev.mayor, [field]: value }
    }));
  };

  const updateDeputyMayor = (field: string, value: string) => {
    setKeyOfficials(prev => ({
      ...prev,
      deputyMayor: { ...prev.deputyMayor, [field]: value }
    }));
  };

  const updateWard = (index: number, field: string, value: string) => {
    setWardChairpersons(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateEmergency = (index: number, field: string, value: string) => {
    setEmergencyContacts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateStaff = (index: number, field: string, value: string) => {
    setAdministrativeStaff(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800 leading-tight">Dodhara Chandani</h1>
                <p className="text-xs text-slate-500">Municipality Information Hub</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('home')} className="text-slate-600 hover:text-emerald-600">Home</Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-emerald-600">About</Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('officials')} className="text-slate-600 hover:text-emerald-600">Officials</Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('wards')} className="text-slate-600 hover:text-emerald-600">Wards</Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('emergency')} className="text-slate-600 hover:text-emerald-600">Emergency</Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-emerald-600">Contact</Button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Update Button */}
              <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-1">
                    <RefreshCw className="w-4 h-4" />
                    <span>Update</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Last updated: <span className="font-semibold">{formatLastUpdate(lastUpdate)}</span>
                    </p>
                    
                    {updateStatus === 'checking' && (
                      <div className="flex items-center space-x-2 text-amber-600">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{updateMessage}</span>
                      </div>
                    )}
                    
                    {updateStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <AlertDescription className="text-green-700">{updateMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    {updateStatus === 'error' && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <AlertDescription className="text-amber-700">{updateMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex flex-col space-y-2">
                      <Button onClick={checkForUpdates} disabled={updateStatus === 'checking'}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${updateStatus === 'checking' ? 'animate-spin' : ''}`} />
                        Check for Updates
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => { 
                          setShowUpdateDialog(false); 
                          setShowPasswordDialog(true);
                        }}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Edit Data (Password Required)
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => { 
                          setShowUpdateDialog(false); 
                          setShowChangePasswordDialog(true);
                        }}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('home')}>Home</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('about')}>About</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('officials')}>Officials</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('wards')}>Wards</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('emergency')}>Emergency</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection('contact')}>Contact</Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowPasswordDialog(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Edit Data
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Enter Password</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Please enter the admin password to edit the municipality data.
            </p>
            
            {passwordError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <AlertDescription className="text-red-700">{passwordError}</AlertDescription>
              </Alert>
            )}
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => { setShowPasswordDialog(false); setPasswordError(''); setEnteredPassword(''); }}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={verifyPassword}>
                <Lock className="w-4 h-4 mr-2" />
                Unlock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Change Password</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Set a new password for editing the municipality data.
            </p>
            
            {passwordError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <AlertDescription className="text-red-700">{passwordError}</AlertDescription>
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <AlertDescription className="text-green-700">{passwordSuccess}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && changePassword()}
                />
              </div>
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>Show passwords</span>
              </label>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => { setShowChangePasswordDialog(false); setPasswordError(''); setNewPassword(''); setConfirmPassword(''); }}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={changePassword}>
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Mode Banner */}
      {editMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-amber-600" />
              <span className="text-amber-800 font-medium">Edit Mode: You can now edit all contact information</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button size="sm" onClick={saveData} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              Kanchanpur District, Sudurpashchim Province
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {municipalityData.nepaliName}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-emerald-100">
              {municipalityData.name}
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
              Your comprehensive information hub for municipal services, ward representatives, and emergency contacts
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-emerald-50"
                onClick={() => scrollToSection('wards')}
              >
                <User className="w-5 h-5 mr-2" />
                Find Your Ward Representative
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => scrollToSection('emergency')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </Button>
            </div>
            
            {lastUpdate && (
              <p className="mt-6 text-sm text-emerald-200">
                Last updated: {formatLastUpdate(lastUpdate)}
              </p>
            )}
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">10</p>
              <p className="text-sm text-emerald-100">Total Wards</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">56.84</p>
              <p className="text-sm text-emerald-100">Area (km²)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">39,253</p>
              <p className="text-sm text-emerald-100">Population</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">2014</p>
              <p className="text-sm text-emerald-100">Established</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">About the Municipality</h2>
            <Separator className="w-24 mx-auto bg-emerald-500" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed">
                Dodhara Chandani Municipality is located in the Kanchanpur District of Sudurpashchim Province, Nepal. 
                It was established on 18 May 2014 by merging the former Village Development Committees of
                <strong> Dodhara</strong> and <strong>Chandani</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The municipality was briefly renamed to Mahakali in 2017 after the Mahakali River, but was 
                later reverted to Dodhara Chandani in 2021. It is one of only two municipalities in Nepal 
                located west of the Mahakali River.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Geographically, it spans from 80°04' to 80°06'30" East longitude and 28°49' to 28°59' North latitude, 
                covering an area of 56.84 square kilometers. It borders India on three sides (north, west, and south) 
                and Bhimdatta Municipality and Shuklaphanta National Park to the east.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Location</p>
                    <p className="text-sm text-slate-600">Kanchanpur, Sudurpashchim</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Coordinates</p>
                    <p className="text-sm text-slate-600">28.90°N 80.09°E</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Map Image */}
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img 
                  src="/dodhara-chandani-map.jpg" 
                  alt="Map of Dodhara Chandani Municipality" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-semibold">Municipality Map</p>
                  <p className="text-white/80 text-sm">Showing wards, rivers, and neighboring areas</p>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-emerald-50 border-emerald-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-emerald-600 mb-1">43</p>
                    <p className="text-slate-700 text-sm font-medium">Schools</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600 mb-1">37.5°C</p>
                    <p className="text-slate-700 text-sm font-medium">Max Temp</p>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-amber-600 mb-1">53.9%</p>
                    <p className="text-slate-700 text-sm font-medium">Nepali</p>
                  </CardContent>
                </Card>
                <Card className="bg-rose-50 border-rose-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-rose-600 mb-1">70.7%</p>
                    <p className="text-slate-700 text-sm font-medium">Literacy</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Officials Section */}
      <section id="officials" className="py-16 lg:py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Key Officials</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Meet the elected representatives and administrative leaders of Dodhara Chandani Municipality</p>
            <Separator className="w-24 mx-auto bg-emerald-500 mt-4" />
          </div>

          {/* Mayor and Deputy Mayor */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 transition-colors">
              <div className="h-2 bg-emerald-600"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Elected Official</Badge>
                  <Building2 className="w-8 h-8 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-3">
                    <Input value={keyOfficials.mayor.name} onChange={(e) => updateMayor('name', e.target.value)} placeholder="Name" />
                    <Input value={keyOfficials.mayor.nepaliName} onChange={(e) => updateMayor('nepaliName', e.target.value)} placeholder="Nepali Name" />
                    <Input value={keyOfficials.mayor.phone} onChange={(e) => updateMayor('phone', e.target.value)} placeholder="Phone" />
                    <Input value={keyOfficials.mayor.email} onChange={(e) => updateMayor('email', e.target.value)} placeholder="Email" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-slate-800">{keyOfficials.mayor.name}</h3>
                    <p className="text-lg text-slate-600 mb-1">{keyOfficials.mayor.nepaliName}</p>
                    <p className="text-emerald-600 font-semibold mb-4">{keyOfficials.mayor.title} | {keyOfficials.mayor.nepaliTitle}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <a href={`tel:${keyOfficials.mayor.phone}`} className="text-slate-700 hover:text-emerald-600">{keyOfficials.mayor.phone}</a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <a href={`mailto:${keyOfficials.mayor.email}`} className="text-slate-700 hover:text-emerald-600">{keyOfficials.mayor.email}</a>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <div className="h-2 bg-blue-600"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Elected Official</Badge>
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-3">
                    <Input value={keyOfficials.deputyMayor.name} onChange={(e) => updateDeputyMayor('name', e.target.value)} placeholder="Name" />
                    <Input value={keyOfficials.deputyMayor.nepaliName} onChange={(e) => updateDeputyMayor('nepaliName', e.target.value)} placeholder="Nepali Name" />
                    <Input value={keyOfficials.deputyMayor.phone} onChange={(e) => updateDeputyMayor('phone', e.target.value)} placeholder="Phone" />
                    <Input value={keyOfficials.deputyMayor.email} onChange={(e) => updateDeputyMayor('email', e.target.value)} placeholder="Email" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-slate-800">{keyOfficials.deputyMayor.name}</h3>
                    <p className="text-lg text-slate-600 mb-1">{keyOfficials.deputyMayor.nepaliName}</p>
                    <p className="text-blue-600 font-semibold mb-4">{keyOfficials.deputyMayor.title} | {keyOfficials.deputyMayor.nepaliTitle}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <a href={`tel:${keyOfficials.deputyMayor.phone}`} className="text-slate-700 hover:text-blue-600">{keyOfficials.deputyMayor.phone}</a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <a href={`mailto:${keyOfficials.deputyMayor.email}`} className="text-slate-700 hover:text-blue-600">{keyOfficials.deputyMayor.email}</a>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Administrative Staff */}
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Administrative Staff</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {administrativeStaff.map((staff, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {editMode ? (
                    <div className="space-y-2">
                      <Input value={staff.name} onChange={(e) => updateStaff(index, 'name', e.target.value)} placeholder="Name" />
                      <Input value={staff.nepaliName} onChange={(e) => updateStaff(index, 'nepaliName', e.target.value)} placeholder="Nepali Name" />
                      <Input value={staff.position} onChange={(e) => updateStaff(index, 'position', e.target.value)} placeholder="Position" />
                      <Input value={staff.phone} onChange={(e) => updateStaff(index, 'phone', e.target.value)} placeholder="Phone" />
                    </div>
                  ) : (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{staff.name}</h4>
                        <p className="text-sm text-slate-600">{staff.nepaliName}</p>
                        <p className="text-emerald-600 text-sm font-medium mt-1">{staff.position}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <a href={`tel:${staff.phone}`} className="text-sm text-slate-700 hover:text-emerald-600">{staff.phone}</a>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ward Chairpersons Section */}
      <section id="wards" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Ward Chairpersons</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Contact information for all 10 ward representatives in Dodhara Chandani Municipality</p>
            <Separator className="w-24 mx-auto bg-emerald-500 mt-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wardChairpersons.map((ward, index) => (
              <Card key={ward.ward} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-600 text-white">Ward {ward.ward}</Badge>
                    {ward.note && <Badge variant="outline" className="text-amber-600 border-amber-300">{ward.note}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editMode ? (
                    <div className="space-y-2">
                      <Input value={ward.name} onChange={(e) => updateWard(index, 'name', e.target.value)} placeholder="Name" />
                      <Input value={ward.nepaliName} onChange={(e) => updateWard(index, 'nepaliName', e.target.value)} placeholder="Nepali Name" />
                      <Input value={ward.phone} onChange={(e) => updateWard(index, 'phone', e.target.value)} placeholder="Phone" />
                      <Input value={ward.email} onChange={(e) => updateWard(index, 'email', e.target.value)} placeholder="Email" />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-slate-800">{ward.name}</h3>
                      <p className="text-slate-600 mb-4">{ward.nepaliName}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-emerald-600" />
                          <a href={`tel:${ward.phone}`} className="text-slate-700 hover:text-emerald-600 font-medium">{ward.phone}</a>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-emerald-600" />
                          <a href={`mailto:${ward.email}`} className="text-sm text-slate-600 hover:text-emerald-600">{ward.email}</a>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts Section */}
      <section id="emergency" className="py-16 lg:py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Emergency Contacts</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Important contact numbers for police and emergency services</p>
            <Separator className="w-24 mx-auto bg-red-500 mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="border-red-100 hover:border-red-300 transition-colors">
                <CardContent className="p-6">
                  {editMode ? (
                    <div className="space-y-2">
                      <Input value={contact.service} onChange={(e) => updateEmergency(index, 'service', e.target.value)} placeholder="Service Name" />
                      <Input value={contact.nepaliService} onChange={(e) => updateEmergency(index, 'nepaliService', e.target.value)} placeholder="Nepali Name" />
                      <Input value={contact.location} onChange={(e) => updateEmergency(index, 'location', e.target.value)} placeholder="Location" />
                      <Input value={contact.phone} onChange={(e) => updateEmergency(index, 'phone', e.target.value)} placeholder="Phone" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                        <Shield className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 text-center mb-1">{contact.service}</h3>
                      <p className="text-slate-600 text-center mb-4">{contact.nepaliService}</p>
                      <p className="text-sm text-slate-500 text-center mb-4">{contact.location}</p>
                      <div className="flex items-center justify-center space-x-2 bg-red-50 rounded-lg p-3">
                        <Phone className="w-5 h-5 text-red-600" />
                        <a href={`tel:${contact.phone}`} className="text-xl font-bold text-red-600 hover:text-red-700">{contact.phone}</a>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 text-lg">Municipality Office</h4>
                <p className="text-amber-700 mb-2">दोधारा चादँनी नगरपालिका कार्यालय</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-amber-600">Phone:</span>
                    <a href={`tel:${municipalityData.phone}`} className="font-semibold text-amber-800 hover:text-amber-900">{municipalityData.phone}</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-amber-600">Toll Free:</span>
                    <a href={`tel:${municipalityData.tollFree}`} className="font-semibold text-amber-800 hover:text-amber-900">{municipalityData.tollFree}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Contact Information</h2>
            <Separator className="w-24 mx-auto bg-emerald-500 mt-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                  <span>Municipality Office</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">Dodhara Chandani Municipality</p>
                    <p className="text-slate-600">Kanchanpur District</p>
                    <p className="text-slate-600">Sudurpashchim Province, Nepal</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <a href={`tel:${municipalityData.phone}`} className="text-slate-700 hover:text-emerald-600">{municipalityData.phone}</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <a href={`mailto:${municipalityData.email}`} className="text-slate-700 hover:text-emerald-600">{municipalityData.email}</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Facebook className="w-5 h-5 text-slate-400" />
                  <a href={municipalityData.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-emerald-600">Facebook Page</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-emerald-600" />
                  <span>Official Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-800 mb-2">Official Website</p>
                  <a 
                    href="https://dodharachandanimun.gov.np/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    dodharachandanimun.gov.np
                  </a>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-800 mb-2">Wikipedia</p>
                  <a 
                    href="https://en.wikipedia.org/wiki/Mahakali,_Kanchanpur" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Mahakali, Kanchanpur - Wikipedia
                  </a>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="font-semibold text-emerald-800 mb-2">Last Updated</p>
                  <p className="text-lg text-emerald-700 font-medium">
                    {formatLastUpdate(lastUpdate)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Data last modified on this date
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Dodhara Chandani</h3>
                  <p className="text-sm text-slate-400">Municipality Information Hub</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                A comprehensive information portal for residents and visitors of Dodhara Chandani Municipality.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-emerald-400 transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors">About Municipality</button></li>
                <li><button onClick={() => scrollToSection('officials')} className="hover:text-emerald-400 transition-colors">Key Officials</button></li>
                <li><button onClick={() => scrollToSection('wards')} className="hover:text-emerald-400 transition-colors">Ward Representatives</button></li>
                <li><button onClick={() => scrollToSection('emergency')} className="hover:text-emerald-400 transition-colors">Emergency Contacts</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{municipalityData.phone}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{municipalityData.email}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Kanchanpur, Nepal</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-slate-700" />
          
          <div className="text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Dodhara Chandani Municipality Information Hub. All rights reserved.</p>
            <p className="mt-1">Data sourced from official municipality website and public records.</p>
            <p className="mt-1 text-xs">Last updated: {formatLastUpdate(lastUpdate)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
