import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Sidebar & Navigation
      "dashboard": "Dashboard",
      "my_machinery": "My Machinery",
      "operators": "Operators & Staff",
      "settings": "Settings",
      "logout": "Log Out",
      "search_placeholder": "Search assets...",
      "notifications": "Notifications",
      "view_profile": "View Profile",
      "manager_pro": "Manager Pro",

      // Dashboard
      "total_assets": "Total Assets",
      "active_staff": "Active Staff",
      "fuel_consumption": "Fuel Consumption",
      "fleet_health": "Fleet Health",
      "recent_activity": "Recent Activity",
      "quick_actions": "Quick Actions",
      "add_asset": "Add Asset",
      "add_member": "Add Member",
      "view_reports": "View Reports",

      // Settings Tabs
      "my_profile": "My Profile",
      "cooperative": "Cooperative",
      "security": "Security",
      "personal_profile": "Personal Profile",
      "profile_photo": "Profile Photo",
      "generate_random": "Generate New Random",
      "display_name": "Display Name",
      "phone_number": "Phone Number",
      "email_address": "Email Address",
      "save_profile": "Save Profile",
      "saving": "Saving...",

      // Cooperative Tab
      "coop_details": "Cooperative Details",
      "coop_name": "Cooperative Name",
      "location": "Location",
      "language": "Language",
      "save_details": "Save Details",

      // Notifications Tab
      "notif_preferences": "Notification Preferences",
      "email_alerts": "Email Alerts",
      "email_desc": "Receive weekly summary reports.",
      "sms_alerts": "SMS Alerts",
      "sms_desc": "Get text messages for critical failures.",
      "maint_reminders": "Maintenance Reminders",
      "maint_desc": "Notify when machines hit service hours.",

      // Security Tab
      "security_data": "Security & Data",
      "new_password": "New Password",
      "update_password": "Update Password",
      "danger_zone": "Danger Zone",
      "factory_reset": "Factory Reset",
      "reset_desc": "Deletes ALL machines & history.",
      "reset_data": "Reset Data"
    }
  },
  rw: {
    translation: {
      "dashboard": "Incamake",
      "my_machinery": "Imashini Zanjye",
      "operators": "Abakozi",
      "settings": "Igenamiterere",
      "logout": "Sohoka",
      "search_placeholder": "Shakisha...",
      "notifications": "Intego",
      "view_profile": "Reba Umwirondoro",
      "manager_pro": "Umuyobozi Mukuru",

      "total_assets": "Imashini Zose",
      "active_staff": "Abakozi Bari Ku Kazi",
      "fuel_consumption": "Lisansi Yakoreshejwe",
      "fleet_health": "Ubuzima bw'Imashini",
      "recent_activity": "Ibikorwa bya Vuba",
      "quick_actions": "Ibikorwa byihuse",
      "add_asset": "Ongeramo Imashini",
      "add_member": "Ongeramo Umukozi",
      "view_reports": "Reba Raporo",

      "my_profile": "Umwirondoro",
      "cooperative": "Koperative",
      "security": "Umutekano",
      "personal_profile": "Umwirondoro Wanjye",
      "profile_photo": "Ifoto",
      "generate_random": "Hindura Ifoto",
      "display_name": "Amazina",
      "phone_number": "Nimero ya Telefone",
      "email_address": "Imeli",
      "save_profile": "Bika",
      "saving": "Bika...",

      "coop_details": "Amakuru ya Koperative",
      "coop_name": "Izina rya Koperative",
      "location": "Aho Iherereye",
      "language": "Ururimi",
      "save_details": "Bika Amakuru",

      "notif_preferences": "Ubutumwa",
      "email_alerts": "Ubutumwa bwa Email",
      "email_desc": "Raporo ya buri cyumweru.",
      "sms_alerts": "Ubutumwa bwa SMS",
      "sms_desc": "Kumenyeshwa ibibazo bikomeye.",
      "maint_reminders": "Kwibukijwe Gukora Imodoka",
      "maint_desc": "Iyo imodoka ikeneye gukorwa.",

      "security_data": "Umutekano n'Amakuru",
      "new_password": "Ijambo ry'Ibanga Rishya",
      "update_password": "Hindura",
      "danger_zone": "Aho Kwitondera",
      "factory_reset": "Gusiba Byose",
      "reset_desc": "Gusiba imashini zose n'amateka.",
      "reset_data": "Siba Byose"
    }
  },
  fr: {
    translation: {
      "dashboard": "Tableau de Bord",
      "my_machinery": "Mes Machines",
      "operators": "Opérateurs",
      "settings": "Paramètres",
      "logout": "Déconnexion",
      "search_placeholder": "Rechercher...",
      "notifications": "Notifications",
      "view_profile": "Voir le profil",
      "manager_pro": "Gestion Pro",

      "total_assets": "Total des Actifs",
      "active_staff": "Personnel Actif",
      "fuel_consumption": "Consommation",
      "fleet_health": "Santé de la Flotte",
      "recent_activity": "Activité Récente",
      "quick_actions": "Actions Rapides",
      "add_asset": "Ajouter Machine",
      "add_member": "Ajouter Membre",
      "view_reports": "Voir Rapports",

      "my_profile": "Mon Profil",
      "cooperative": "Coopérative",
      "security": "Sécurité",
      "personal_profile": "Profil Personnel",
      "profile_photo": "Photo de Profil",
      "generate_random": "Générer Aléatoire",
      "display_name": "Nom d'affichage",
      "phone_number": "Téléphone",
      "email_address": "Adresse Email",
      "save_profile": "Enregistrer",
      "saving": "Enregistrement...",

      "coop_details": "Détails Coopérative",
      "coop_name": "Nom de la Coopérative",
      "location": "Emplacement",
      "language": "Langue",
      "save_details": "Enregistrer",

      "notif_preferences": "Préférences",
      "email_alerts": "Alertes Email",
      "email_desc": "Rapports hebdomadaires.",
      "sms_alerts": "Alertes SMS",
      "sms_desc": "Messages pannes critiques.",
      "maint_reminders": "Rappels d'Entretien",
      "maint_desc": "Notifier l'entretien.",

      "security_data": "Sécurité et Données",
      "new_password": "Nouveau Mot de Passe",
      "update_password": "Mettre à jour",
      "danger_zone": "Zone de Danger",
      "factory_reset": "Réinitialisation",
      "reset_desc": "Supprime TOUTES les machines.",
      "reset_data": "Réinitialiser"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;