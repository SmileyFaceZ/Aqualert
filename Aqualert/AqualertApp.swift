//
//  AqualertApp.swift
//  Aqualert
//
//  Created by Kantaphat Phaphui on 12/3/2568 BE.
//

import SwiftUI
import Firebase

@main
struct AqualertApp: App {
    
    init() {
        FirebaseApp.configure();
        print("config firebase")
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
