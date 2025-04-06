import SwiftUI

struct LoginButton: View {
    var title: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.custom("Poppins-SemiBold", size: 16))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .cornerRadius(12)
                .shadow(color: Color.blue.opacity(0.3), radius: 10, x: 0, y: 5)
        }
        .frame(width: 325)
    }
}

#Preview {
    LoginButton(title: "LOG IN") {
        print("Login Tapped")
    }
}
