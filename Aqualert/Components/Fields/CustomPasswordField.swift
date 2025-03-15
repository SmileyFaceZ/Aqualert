import SwiftUI

struct CustomPasswordField: View {
    var placeholder: String
    @Binding var password: String
    @State private var isSecure: Bool = true

    var body: some View {
        HStack {
            Image(systemName: "lock")
                .foregroundColor(.gray)
            if isSecure {
                SecureField(placeholder, text: $password)
                    .font(.custom("Poppins-Regular", size: 14))
            } else {
                TextField(placeholder, text: $password)
                    .font(.custom("Poppins-Regular", size: 14))
            }
            Spacer()
            Button(action: {
                isSecure.toggle()
            }) {
                Image(systemName: isSecure ? "eye.slash" : "eye")
                    .foregroundColor(.gray)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(.systemGray4), lineWidth: 1)
        )
    }
}
