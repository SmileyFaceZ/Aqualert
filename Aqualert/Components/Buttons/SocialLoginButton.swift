import SwiftUI

struct SocialLoginButton: View {
    var logoName: String
    var text: String
    
    var body: some View {
        
        Button(action: {
            // Action here
        }) {
            HStack(alignment: .center, spacing: 10) {
                Rectangle()
                    .foregroundColor(.clear)
                    .frame(width: 25, height: 30)
                    .background(
                        Image(systemName: logoName)
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 15, height: 15)
                    )
                
                Text(text)
                    .font(Font.custom("Poppins", size: 14))
                    .multilineTextAlignment(.center)
                    .foregroundColor(Color(red: 0.34, green: 0.34, blue: 0.34))
            }
            .padding(.horizontal, 15)
            .padding(.vertical, 10)
            .background(Color(red: 0.96, green: 0.99, blue: 1))
            .cornerRadius(50)
            .overlay(
                RoundedRectangle(cornerRadius: 50)
                    .inset(by: 0.5)
                    .stroke(Color(red: 0.31, green: 0.75, blue: 0.99), lineWidth: 1)
            )
        }
        .frame(width: 325)
    }
}

#Preview {
    SocialLoginButton(logoName: "applelogo", text: "Apple")
}
