import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';

// Definir la interfaz para los datos del formulario
interface PlanPDFProps {
  formData: {
    patient_name: string;
    date: string;
    orientation_name: string;
    recommendation: string;
    additional_info?: string;
  };
  templateTitle?: string;
}

// Registrar fuentes
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

// Definir estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#4F6AF6',
    color: 'white',
    borderRadius: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#D1DAFE',
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#F9FAFC',
    borderRadius: 5,
    borderLeft: '3px solid #4F6AF6'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginBottom: 10,
    color: '#2D3748'
  },
  content: {
    fontSize: 12,
    fontFamily: 'Roboto',
    lineHeight: 1.5,
    color: '#4A5568'
  },
  patientInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  infoBox: {
    backgroundColor: '#EDF2F7',
    padding: 10,
    borderRadius: 5,
    width: '48%'
  },
  infoLabel: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 5,
    fontFamily: 'Roboto'
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#2D3748'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#A0AEC0',
    textAlign: 'center',
    fontFamily: 'Roboto',
    borderTop: '1px solid #E2E8F0',
    paddingTop: 10
  }
});

// Componente que define el documento PDF
const PlanDocument = ({ formData, templateTitle }: PlanPDFProps) => {
  // Usar el título de la plantilla si está disponible, o un título predeterminado
  const documentTitle = templateTitle || 'Plan de Prevención y Reducción de Riesgos';
  
  // Generar un subtítulo adecuado
  const documentSubtitle = templateTitle 
    ? 'Documento personalizado generado con React-PDF' 
    : 'Documento generado para fomentar el envejecimiento saludable';
    
  return (
    <Document title={`${documentTitle} - ${formData.patient_name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{documentTitle}</Text>
          <Text style={styles.subtitle}>{documentSubtitle}</Text>
        </View>

        <View style={styles.patientInfo}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Paciente</Text>
            <Text style={styles.infoValue}>{formData.patient_name}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>{formData.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <Text style={styles.content}>{formData.recommendation}</Text>
        </View>

        {formData.additional_info && formData.additional_info.trim() !== '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Adicional</Text>
            <Text style={styles.content}>{formData.additional_info}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Documento elaborado por: {formData.orientation_name}</Text>
          <Text>Este documento es confidencial y para uso exclusivo del paciente.</Text>
        </View>
      </Page>
    </Document>
  );
};

// Componente de vista previa del PDF
export const PlanPDFViewer = ({ formData, templateTitle }: PlanPDFProps) => (
  <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
    <PlanDocument formData={formData} templateTitle={templateTitle} />
  </PDFViewer>
);

// Componente para descargar el PDF
export const PlanPDF = ({ formData, templateTitle }: PlanPDFProps) => (
  <PlanDocument formData={formData} templateTitle={templateTitle} />
); 