// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   Image,
// //   StyleSheet,
// //   ScrollView,
// //   ActivityIndicator,
// //   ToastAndroid,
// // } from "react-native";
// // import { useNavigation, NavigationProp } from "@react-navigation/native";
// // import * as ImagePicker from "expo-image-picker";
// // import axios, { AxiosError } from "axios";
// // import { FontAwesome } from "@expo/vector-icons";
// // import { useAppSelector } from "@/store/hooks";
// // import uploadImage from "@/utils/uploadImage";
// // import { BASE_URL } from "@/utils/apiConfig";

// // type RootStackParamList = {
// //   login: undefined;
// //   signup: undefined;
// //   // Add other screens as needed
// // };

// // interface FormData {
// //   userName: string;
// //   email: string;
// //   password: string;
// //   confirmPassword: string;
// //   profilePic: string;
// //   phoneNumber: string; // Added phone number field
// // }

// // const SignUp = () => {
// //   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [formData, setFormData] = useState<FormData>({
// //     userName: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //     profilePic: "",
// //     phoneNumber: "", // Initialize phone number
// //   });
// //   const [error, setError] = useState("");
// //   const [uploading, setUploading] = useState(false);
// //   const [imageSelected, setImageSelected] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const handleUploadPic = async () => {
// //     try {
// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         aspect: [1, 1],
// //         quality: 1,
// //       });

// //       if (!result.canceled) {
// //         setImageSelected(true);
// //         setUploading(true);
// //         const uploadResponse = await uploadImage(result.assets[0]);
// //         setFormData((prev) => ({
// //           ...prev,
// //           profilePic: uploadResponse.secure_url,
// //         }));
// //         ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
// //       }
// //     } catch (error) {
// //       console.log("error::: ", error);
// //       alert("Image upload failed");
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (uploading) {
// //       setError("Please wait for the image to finish uploading");
// //       alert("Please wait for the image to finish uploading");
// //       return;
// //     }
// //     if (formData.phoneNumber.length <= 9) {
// //       setError("Please enter 10 number");
// //       alert("Please enter 10 number");
// //       return;
// //     }
// //     if (formData.password !== formData.confirmPassword) {
// //       setError("Passwords do not match!");
// //       alert("Passwords do not match!");
// //       return;
// //     }

// //     // Validate phone number
// //     if (!formData.phoneNumber) {
// //       setError("Phone number is required!");
// //       alert("Phone number is required!");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       // Create API payload with phone number as string
// //       const apiPayload = {
// //         ...formData,
// //         phoneNumber: formData.phoneNumber.toString(),
// //       };

// //       const response = await axios.post(`${BASE_URL}/signup`, apiPayload);
// //       ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
// //       setError("");
// //       navigation.navigate("login");
// //     } catch (err) {
// //       const error = err as AxiosError<{ error: string }>;
// //       const errorMessage = error.response?.data?.error || "An error occurred";
// //       setError(errorMessage);
// //       alert(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.card}>
// //         <View style={styles.profileContainer}>
// //           <Image
// //             source={
// //               formData.profilePic
// //                 ? { uri: formData.profilePic }
// //                 : require("@/assets/images/signin.gif")
// //             }
// //             style={styles.profileImage}
// //           />
// //           <TouchableOpacity
// //             style={styles.uploadButton}
// //             onPress={handleUploadPic}
// //             disabled={uploading}
// //           >
// //             <Text style={styles.uploadButtonText}>
// //               {uploading ? "Uploading..." : "Upload Photo"}
// //             </Text>
// //           </TouchableOpacity>
// //         </View>

// //         <View style={styles.form}>
// //           <View style={styles.inputContainer}>
// //             <Text style={styles.label}>Name:</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter your name"
// //               value={formData.userName}
// //               onChangeText={(text) =>
// //                 setFormData((prev) => ({ ...prev, userName: text }))
// //               }
// //               autoCapitalize="none"
// //             />
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Text style={styles.label}>Email:</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter your email"
// //               value={formData.email}
// //               onChangeText={(text) =>
// //                 setFormData((prev) => ({ ...prev, email: text }))
// //               }
// //               keyboardType="email-address"
// //               autoCapitalize="none"
// //             />
// //           </View>

// //           {/* Added Phone Number Field */}
// //           <View style={styles.inputContainer}>
// //             <Text style={styles.label}>Phone Number:</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter your phone number"
// //               value={formData.phoneNumber}
// //               onChangeText={(text) =>
// //                 setFormData((prev) => ({ ...prev, phoneNumber: text }))
// //               }
// //               keyboardType="phone-pad"
// //             />
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Text style={styles.label}>Password:</Text>
// //             <View style={styles.passwordContainer}>
// //               <TextInput
// //                 style={styles.passwordInput}
// //                 placeholder="Enter your password"
// //                 value={formData.password}
// //                 onChangeText={(text) =>
// //                   setFormData((prev) => ({ ...prev, password: text }))
// //                 }
// //                 secureTextEntry={!showPassword}
// //               />
// //               <TouchableOpacity
// //                 style={styles.eyeIcon}
// //                 onPress={() => setShowPassword(!showPassword)}
// //               >
// //                 <FontAwesome
// //                   name={showPassword ? "eye-slash" : "eye"}
// //                   size={20}
// //                   color="#666"
// //                 />
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Text style={styles.label}>Confirm Password:</Text>
// //             <View style={styles.passwordContainer}>
// //               <TextInput
// //                 style={styles.passwordInput}
// //                 placeholder="Confirm your password"
// //                 value={formData.confirmPassword}
// //                 onChangeText={(text) =>
// //                   setFormData((prev) => ({ ...prev, confirmPassword: text }))
// //                 }
// //                 secureTextEntry={!showConfirmPassword}
// //               />
// //               <TouchableOpacity
// //                 style={styles.eyeIcon}
// //                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
// //               >
// //                 <FontAwesome
// //                   name={showConfirmPassword ? "eye-slash" : "eye"}
// //                   size={20}
// //                   color="#666"
// //                 />
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           {error ? <Text style={styles.errorText}>{error}</Text> : null}

// //           <TouchableOpacity
// //             style={[
// //               styles.submitButton,
// //               (uploading || (imageSelected && !formData.profilePic)) &&
// //                 styles.submitButtonDisabled,
// //             ]}
// //             onPress={handleSubmit}
// //             disabled={
// //               uploading || (imageSelected && !formData.profilePic) || loading
// //             }
// //           >
// //             {loading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <Text style={styles.submitButtonText}>Sign Up</Text>
// //             )}
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={styles.loginLink}
// //             onPress={() => navigation.navigate("login")}
// //           >
// //             <Text style={styles.loginLinkText}>
// //               Already have an account? Log in
// //             </Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // };
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   ToastAndroid,
// } from "react-native";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
// import axios, { AxiosError } from "axios";
// import { FontAwesome } from "@expo/vector-icons";
// import uploadImage from "@/utils/uploadImage";
// import { BASE_URL } from "@/utils/apiConfig";

// type RootStackParamList = {
//   login: undefined;
//   signup: undefined;
//   // Add other screens as needed
// };

// interface FormData {
//   userName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   profilePic: string;
//   phoneNumber: string;
//   otp: string;
// }

// const SignUp = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     userName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     profilePic: "",
//     phoneNumber: "",
//     otp: "",
//   });
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [imageSelected, setImageSelected] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [verifyingOtp, setVerifyingOtp] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);

//   // Handle OTP timer
//   React.useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (otpTimer > 0) {
//       interval = setInterval(() => {
//         setOtpTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [otpTimer]);

//   const handleUploadPic = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setImageSelected(true);
//         setUploading(true);
//         const uploadResponse = await uploadImage(result.assets[0]);
//         setFormData((prev) => ({
//           ...prev,
//           profilePic: uploadResponse.secure_url,
//         }));
//         ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
//       }
//     } catch (error) {
//       console.log("error::: ", error);
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSendOTP = async () => {
//     if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
//       setError("Please enter a valid 10-digit phone number");
//       alert("Please enter a valid 10-digit phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(`${BASE_URL}/initiate-signup`, {
//         phoneNumber: formData.phoneNumber,
//       });
//       setOtpSent(true);
//       setOtpTimer(300); // 5 minutes timer
//       ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
//     } catch (err) {
//       const error = err as AxiosError<{ error: string }>;
//       const errorMessage = error.response?.data?.error || "Failed to send OTP";
//       setError(errorMessage);
//       alert(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     if (otpTimer > 0) return;

//     try {
//       const response = await axios.post(`${BASE_URL}/resend-otp`, {
//         phoneNumber: formData.phoneNumber,
//       });
//       setOtpTimer(300); // Reset timer to 5 minutes
//       ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);
//     } catch (err) {
//       const error = err as AxiosError<{ error: string }>;
//       const errorMessage =
//         error.response?.data?.error || "Failed to resend OTP";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   const handleSubmit = async () => {
//     if (uploading) {
//       setError("Please wait for the image to finish uploading");
//       alert("Please wait for the image to finish uploading");
//       return;
//     }

//     if (!otpSent) {
//       handleSendOTP();
//       return;
//     }

//     if (!formData.otp) {
//       setError("Please enter the OTP");
//       alert("Please enter the OTP");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match!");
//       alert("Passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const apiPayload = {
//         ...formData,
//         phoneNumber: formData.phoneNumber.toString(),
//       };

//       const response = await axios.post(`${BASE_URL}/signup`, apiPayload);
//       ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
//       setError("");
//       navigation.navigate("login");
//     } catch (err) {
//       const error = err as AxiosError<{ error: string }>;
//       const errorMessage = error.response?.data?.error || "An error occurred";
//       setError(errorMessage);
//       alert(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.profileContainer}>
//           <Image
//             source={
//               formData.profilePic
//                 ? { uri: formData.profilePic }
//                 : require("@/assets/images/signin.gif")
//             }
//             style={styles.profileImage}
//           />
//           <TouchableOpacity
//             style={styles.uploadButton}
//             onPress={handleUploadPic}
//             disabled={uploading}
//           >
//             <Text style={styles.uploadButtonText}>
//               {uploading ? "Uploading..." : "Upload Photo"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.form}>
//           {/* Phone Number Field - Always visible */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Phone Number:</Text>
//             <View style={styles.phoneInputContainer}>
//               <TextInput
//                 style={[styles.input, styles.phoneInput]}
//                 placeholder="Enter your phone number"
//                 value={formData.phoneNumber}
//                 onChangeText={(text) =>
//                   setFormData((prev) => ({ ...prev, phoneNumber: text }))
//                 }
//                 keyboardType="phone-pad"
//                 maxLength={10}
//                 editable={!otpSent}
//               />
//               {!otpSent && (
//                 <TouchableOpacity
//                   style={styles.sendOtpButton}
//                   onPress={handleSendOTP}
//                   disabled={loading || formData.phoneNumber.length !== 10}
//                 >
//                   <Text style={styles.sendOtpButtonText}>
//                     {loading ? "Sending..." : "Send OTP"}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* OTP Input - Visible after OTP is sent */}
//           {otpSent && (
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Enter OTP:</Text>
//               <View style={styles.otpContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter OTP"
//                   value={formData.otp}
//                   onChangeText={(text) =>
//                     setFormData((prev) => ({ ...prev, otp: text }))
//                   }
//                   keyboardType="number-pad"
//                   maxLength={6}
//                 />
//                 {otpTimer > 0 ? (
//                   <Text style={styles.timerText}>{formatTime(otpTimer)}</Text>
//                 ) : (
//                   <TouchableOpacity
//                     style={styles.resendButton}
//                     onPress={handleResendOTP}
//                   >
//                     <Text style={styles.resendButtonText}>Resend OTP</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           )}

//           {/* Rest of the form - Visible after OTP is sent */}
//           {otpSent && (
//             <>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Name:</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your name"
//                   value={formData.userName}
//                   onChangeText={(text) =>
//                     setFormData((prev) => ({ ...prev, userName: text }))
//                   }
//                   autoCapitalize="none"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Email:</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChangeText={(text) =>
//                     setFormData((prev) => ({ ...prev, email: text }))
//                   }
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Password:</Text>
//                 <View style={styles.passwordContainer}>
//                   <TextInput
//                     style={styles.passwordInput}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChangeText={(text) =>
//                       setFormData((prev) => ({ ...prev, password: text }))
//                     }
//                     secureTextEntry={!showPassword}
//                   />
//                   <TouchableOpacity
//                     style={styles.eyeIcon}
//                     onPress={() => setShowPassword(!showPassword)}
//                   >
//                     <FontAwesome
//                       name={showPassword ? "eye-slash" : "eye"}
//                       size={20}
//                       color="#666"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Confirm Password:</Text>
//                 <View style={styles.passwordContainer}>
//                   <TextInput
//                     style={styles.passwordInput}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChangeText={(text) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         confirmPassword: text,
//                       }))
//                     }
//                     secureTextEntry={!showConfirmPassword}
//                   />
//                   <TouchableOpacity
//                     style={styles.eyeIcon}
//                     onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     <FontAwesome
//                       name={showConfirmPassword ? "eye-slash" : "eye"}
//                       size={20}
//                       color="#666"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </>
//           )}

//           {error ? <Text style={styles.errorText}>{error}</Text> : null}

//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               (uploading ||
//                 (imageSelected && !formData.profilePic) ||
//                 loading) &&
//                 styles.submitButtonDisabled,
//             ]}
//             onPress={handleSubmit}
//             disabled={
//               uploading || (imageSelected && !formData.profilePic) || loading
//             }
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 {otpSent ? "Sign Up" : "Send OTP"}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.loginLink}
//             onPress={() => navigation.navigate("login")}
//           >
//             <Text style={styles.loginLinkText}>
//               Already have an account? Log in
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default SignUp;

// const styles = StyleSheet.create({
//   phoneInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },

//   phoneInput: {
//     flex: 1,
//   },

//   sendOtpButton: {
//     backgroundColor: "#4CAF50",
//     padding: 10,
//     borderRadius: 5,
//     minWidth: 100,
//     alignItems: "center",
//   },

//   sendOtpButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },

//   otpContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },

//   timerText: {
//     color: "#666",
//     fontSize: 14,
//     minWidth: 50,
//   },

//   resendButton: {
//     padding: 10,
//   },

//   resendButtonText: {
//     color: "#2196F3",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#f3f4f6",
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   profileContainer: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   uploadButton: {
//     backgroundColor: "rgba(226, 232, 240, 0.8)",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     marginTop: 8,
//   },
//   uploadButtonText: {
//     fontSize: 12,
//     color: "#4a5568",
//     textAlign: "center",
//   },
//   form: {
//     gap: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//     marginBottom: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 14,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 6,
//   },
//   passwordInput: {
//     flex: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 14,
//   },
//   eyeIcon: {
//     padding: 10,
//   },
//   errorText: {
//     color: "#ef4444",
//     fontSize: 14,
//     marginBottom: 12,
//   },
//   submitButton: {
//     backgroundColor: "#4f46e5",
//     paddingVertical: 12,
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   submitButtonDisabled: {
//     backgroundColor: "#9ca3af",
//   },
//   submitButtonText: {
//     color: "white",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   loginLink: {
//     alignSelf: "flex-end",
//     marginTop: 12,
//   },
//   loginLinkText: {
//     color: "#4f46e5",
//     fontSize: 14,
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosError } from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import uploadImage from "@/utils/uploadImage";
import { BASE_URL } from "@/utils/apiConfig";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";

type RootStackParamList = {
  login: undefined;
  signup: undefined;
  // Add other screens as needed
};

interface FormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic: string;
  phoneNumber: string; // Added phone number field
}

const SignUp = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
    phoneNumber: "", // Initialize phone number
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUploadPic = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageSelected(true);
        setUploading(true);
        const uploadResponse = await uploadImage(result.assets[0]);
        setFormData((prev) => ({
          ...prev,
          profilePic: uploadResponse.secure_url,
        }));
        ToastAndroid.show(
          `${t("Image uploaded successfully")}`,
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log("error::: ", error);
      alert(`${t("Image upload failed")}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.userName.trim()) {
      setError(t("Name is required"));
      return;
    }

    // Validate Email
    if (!formData.email.trim()) {
      setError(t("Email is required"));
      return;
    }
    if (!validateEmail(formData.email)) {
      setError(t("Please enter a valid email address"));
      return;
    }

    // Validate Phone Number
    if (!formData.phoneNumber.trim()) {
      setError(t("Phone number is required"));
      return;
    }
    if (formData.phoneNumber.length !== 10) {
      setError(t("Phone number must be exactly 10 digits"));
      return;
    }

    // Validate Password
    if (!formData.password.trim()) {
      setError(t("Password is required"));
      return;
    }
    if (formData.password.length < 6) {
      setError(t("Password must be at least 6 characters long"));
      return;
    }
    if (formData.password.length > 10) {
      setError(t("Password must be maximum 10 characters long"));
      return;
    }

    // Validate Confirm Password
    if (formData.password !== formData.confirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }

    // Check if image is still uploading
    if (uploading) {
      setError(t("Please wait for the image to finish uploading"));
      return;
    }

    setLoading(true);
    try {
      // Create API payload with phone number as string
      const apiPayload = {
        ...formData,
        phoneNumber: formData.phoneNumber.toString(),
      };

      const response = await axios.post(`${BASE_URL}/signup`, apiPayload);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      setError("");
      navigation.navigate("login");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileContainer}>
          <Image
            source={
              formData.profilePic
                ? { uri: formData.profilePic }
                : require("@/assets/images/signin.gif")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadPic}
            disabled={uploading}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? t("Uploading...") : t("Upload Photo")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Name")}:</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Enter your name")}
              value={formData.userName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, userName: text }))
              }
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Email")}:</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Enter your email")}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Added Phone Number Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Phone Number")}:</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Enter your phone number")}
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Password")}:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t("Enter your password")}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome
                  name={showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Confirm Password")}:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t("Confirm your password")}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesome
                  name={showConfirmPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (uploading || (imageSelected && !formData.profilePic)) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              uploading || (imageSelected && !formData.profilePic) || loading
            }
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t("signup")}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupSection}>
            <Text style={styles.signupText}>
              {t("Already have an account?")}
              <Text> </Text>
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>{t("login")}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  uploadButton: {
    backgroundColor: "rgba(226, 232, 240, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    color: "#4a5568",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  loginLink: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  loginLinkText: {
    color: "#4f46e5",
    fontSize: 14,
  },
  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
  },
});
