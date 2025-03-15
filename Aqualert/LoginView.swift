import SwiftUI


struct LoginView: View {
    @State private var email: String = ""
    @State private var password: String = ""
    
    var body: some View {
        VStack(spacing: 24) {
            Image("x-circle")
                .resizable()
                .frame(width: 80, height: 80)
                .shadow(radius: 10)
            
            Text("Login")
                .font(.custom("Poppins-Bold", size: 28))
                .foregroundColor(.primary)
            
            Text("Securely login to your account")
                .font(.custom("Poppins-Regular", size: 14))
                .foregroundColor(.gray)
            
            CustomTextField(icon: "envelope", placeholder: "Email", text: $email)
                .frame(width: 325)
            
            CustomPasswordField(placeholder: "Password", password: $password)
                .frame(width: 325)
            
            LoginButton(title: "LOG IN") {
                print("Login Tapped")
            }
            
            HStack {
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(.gray.opacity(0.3))
                
                Text("OR Continue with")
                    .font(.custom("Poppins-Medium", size: 12))
                    .foregroundColor(.gray)
                
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(.gray.opacity(0.3))
            }
            .padding(.horizontal, 20)
            
            SocialLoginButton(logoName: "applelogo", text: "Apple")
            
            Spacer()
            
            HStack(spacing: 4) {
                Text("Don't have an account?")
                    .font(.custom("Poppins-Regular", size: 12))
                    .foregroundColor(.gray)
                
                Button(action: {
                    // Navigate to Sign Up
                }) {
                    Text("Sign Up")
                        .font(.custom("Poppins-SemiBold", size: 12))
                        .foregroundColor(Color.blue)
                        .underline()
                }
            }
            
            Text("By clicking Continue, you agree to our Terms of Service\nand Privacy Policy")
                .font(.custom("Poppins-Light", size: 10))
                .multilineTextAlignment(.center)
                .foregroundColor(.gray)
                .padding(.horizontal, 20)
                .padding(.bottom, 20)
        }
        .frame(width: 360)
    }
}


#Preview {
    LoginView()
}
