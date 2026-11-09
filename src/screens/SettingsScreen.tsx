import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import { materialCatalog } from '../data/materials';
import { solveGeometry, solvePhysics } from '../utils/solver';
import { saveMeasurement } from '../services/storage';
import { MaterialDensity, MeasurementInput, ShapeType, SolveTarget, UnitSystem } from '../types';

type HomeScreenProps = {
  onOpenSettings: () => void;
  onOpenPrivacy: () => void;
};

export default function HomeScreen({ onOpenSettings, onOpenPrivacy }: HomeScreenProps) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [shapeType, setShapeType] = useState<ShapeType>(ShapeType.Cuboid);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.Centimeter);
  const [solveTarget, setSolveTarget] = useState<SolveTarget>(SolveTarget.Mass);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDensity>(materialCatalog[0]);
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(4);
  const [radius, setRadius] = useState<number>(3);
  const [sideLength, setSideLength] = useState<number>(6);
  const [customDensity, setCustomDensity] = useState<number>(selectedMaterial.densityGcm3);
  const [massKg, setMassKg] = useState<number>(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const input: MeasurementInput = useMemo(
    () => ({
      shapeType,
      length,
      width,
      height,
      radius,
      sideLength,
      densityGcm3: customDensity,
      massKg,
      unitSystem,
      useReferenceScale: true,
      referenceScaleMm: 55,
    }),
    [shapeType, length, width, height, radius, sideLength, customDensity, massKg, unitSystem],
  );

  const geometry = useMemo(() => solveGeometry(input), [input]);
  const physics = useMemo(() => solvePhysics(input, geometry), [input, geometry]);

  const requestCameraAccess = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Camera access needed',
        'DimensionMass AI needs camera permission to estimate object size and mass locally.',
      );
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Camera unavailable', 'The camera is not ready yet.');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      const uri = photo?.uri ?? null;
      setPhotoUri(uri);

      await saveMeasurement({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        shapeType,
        length,
        width,
        height,
        radius,
        sideLength,
        densityGcm3: customDensity,
        volumeCm3: geometry.volumeCm3,
        massKg: physics.massKg,
        photoUri: uri ?? undefined,
      });
    } catch (error) {
      Alert.alert('Capture failed', 'Unable to capture the image right now.');
    }
  };

  const cameraEnabled = permission?.status === 'granted';

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>DimensionMass AI</Text>
          <TouchableOpacity style={styles.headerButton} onPress={onOpenSettings}>
            <Text style={styles.headerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cameraShell}>
          {cameraEnabled ? (
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
              <View style={styles.overlay}>
                <View style={styles.boundingBox} />
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionTitle}>Camera access</Text>
              <Text style={styles.permissionText}>
                DimensionMass AI uses the camera for local measurement and physics estimation.
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={requestCameraAccess}>
                <Text style={styles.primaryButtonText}>Allow camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setFacing('back')}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setFacing('front')}>
              <Text style={styles.secondaryButtonText}>Front</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Measurement</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Shape</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={shapeType}
                  onValueChange={(value) => setShapeType(value as ShapeType)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Rectangular Cuboid" value={ShapeType.Cuboid} />
                  <Picker.Item label="Cylinder" value={ShapeType.Cylinder} />
                  <Picker.Item label="Sphere" value={ShapeType.Sphere} />
                  <Picker.Item label="Cone" value={ShapeType.Cone} />
                  <Picker.Item label="Pyramid" value={ShapeType.Pyramid} />
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Unit</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={unitSystem}
                  onValueChange={(value) => setUnitSystem(value as UnitSystem)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Millimeter" value={UnitSystem.Millimeter} />
                  <Picker.Item label="Centimeter" value={UnitSystem.Centimeter} />
                  <Picker.Item label="Meter" value={UnitSystem.Meter} />
                  <Picker.Item label="Inch" value={UnitSystem.Inch} />
                  <Picker.Item label="Foot" value={UnitSystem.Foot} />
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Solve for</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={solveTarget}
                  onValueChange={(value) => setSolveTarget(value as SolveTarget)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Mass" value={SolveTarget.Mass} />
                  <Picker.Item label="Density" value={SolveTarget.Density} />
                </Picker>
              </View>
            </View>

            <TextInput
              style={styles.input}
              value={String(length)}
              onChangeText={(text) => setLength(Number(text) || 0)}
              placeholder="Length"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />
            <TextInput
              style={styles.input}
              value={String(width)}
              onChangeText={(text) => setWidth(Number(text) || 0)}
              placeholder="Width"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />
            <TextInput
              style={styles.input}
              value={String(height)}
              onChangeText={(text) => setHeight(Number(text) || 0)}
              placeholder="Height"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />
            <TextInput
              style={styles.input}
              value={String(radius)}
              onChangeText={(text) => setRadius(Number(text) || 0)}
              placeholder="Radius"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />
            <TextInput
              style={styles.input}
              value={String(sideLength)}
              onChangeText={(text) => setSideLength(Number(text) || 0)}
              placeholder="Side length"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />

            <TextInput
              style={styles.input}
              value={String(customDensity)}
              onChangeText={(text) => setCustomDensity(Number(text) || 0)}
              placeholder="Density (g/cm³)"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />

            <TextInput
              style={styles.input}
              value={String(massKg)}
              onChangeText={(text) => setMassKg(Number(text) || 0)}
              placeholder="Known mass (kg)"
              keyboardType="decimal-pad"
              placeholderTextColor="#a0aec0"
            />

            <View style={styles.field}>
              <Text style={styles.label}>Material</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={selectedMaterial.name}
                  onValueChange={(value) => {
                    const material = materialCatalog.find((entry) => entry.name === value);
                    if (material) {
                      setSelectedMaterial(material);
                      setCustomDensity(material.densityGcm3);
                    }
                  }}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  {materialCatalog.map((material) => (
                    <Picker.Item key={material.name} label={material.name} value={material.name} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.primaryButton} onPress={capturePhoto}>
                <Text style={styles.primaryButtonText}>Capture</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={onOpenPrivacy}>
                <Text style={styles.secondaryButtonText}>Privacy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.sectionTitle}>Results</Text>
            <ResultRow label="Volume" value={`${geometry.volumeM3.toFixed(5)} m³`} />
            <ResultRow label="Surface area" value={`${geometry.surfaceAreaM2.toFixed(5)} m²`} />
            <ResultRow label="Volume" value={`${geometry.volumeCm3.toFixed(2)} cm³`} />
            <ResultRow label="Mass" value={`${physics.massKg.toFixed(4)} kg`} />
            <ResultRow label="Mass" value={`${physics.massG.toFixed(2)} g`} />
            <ResultRow label="Density" value={`${physics.densityGcm3.toFixed(4)} g/cm³`} />
            <ResultRow label="Density" value={`${physics.densityKgM3.toFixed(2)} kg/m³`} />
            <ResultRow label="Pounds" value={`${physics.massLb.toFixed(4)} lb`} />
            <ResultRow label="Ounces" value={`${physics.massOz.toFixed(4)} oz`} />
            <ResultRow label="Target" value={solveTarget.toUpperCase()} />
          </View>

          {photoUri ? (
            <View style={styles.photoPreview}>
              <Text style={styles.sectionTitle}>Saved snapshot</Text>
              <Text style={styles.photoUri}>{photoUri}</Text>
            </View>
          ) : null}

          <Text style={styles.disclaimer}>
            Disclaimer: measurements and physical estimates are approximate and should be verified
            before industrial, legal, or safety-critical use.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#08111f',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  headerButton: {
    backgroundColor: '#1f3b73',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cameraShell: {
    height: 260,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#0e1728',
    borderWidth: 1,
    borderColor: '#27364d',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boundingBox: {
    width: 220,
    height: 180,
    borderWidth: 2,
    borderColor: '#52b4ff',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0b1220',
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  permissionText: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#0b1422',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#23314d',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: '#dbeafe',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  pickerWrap: {
    borderRadius: 12,
    backgroundColor: '#111b2d',
    borderWidth: 1,
    borderColor: '#2c3d5d',
  },
  picker: {
    color: '#fff',
    height: 48,
  },
  input: {
    backgroundColor: '#111b2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2c3d5d',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginRight: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1c2d49',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#0b1422',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#23314d',
    padding: 14,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    color: '#cbd5e1',
  },
  resultValue: {
    color: '#fff',
    fontWeight: '700',
  },
  photoPreview: {
    backgroundColor: '#0b1422',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#23314d',
    padding: 14,
    marginBottom: 16,
  },
  photoUri: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  disclaimer: {
    color: '#fbbf24',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});
