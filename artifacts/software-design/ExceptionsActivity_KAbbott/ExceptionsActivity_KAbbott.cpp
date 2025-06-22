// Name: Keon Abbott
// Course: CS 405-10907
// Enhanced for CS 499 Capstone Milestone Two
// (KA) Cleaned up and modularized for better structure and readability

#include <iostream>
#include <stdexcept>
#include <string>

// (KA) Custom exception class — lets me pass in more helpful error messages
class CustomException : public std::exception {
public:
    CustomException(const std::string& msg) : message(msg) {}
    const char* what() const noexcept override {
        return message.c_str();
    }
private:
    std::string message;
};

// (KA) Centralized error logging — keeps all the messy stderr stuff out of the way
class ErrorLogger {
public:
    static void logError(const std::string& msg) {
        std::cerr << "[ERROR] " << msg << std::endl;
    }
};

// (KA) This function intentionally throws a standard runtime error to simulate a failure
void doEvenMoreCustomLogic() {
    std::cout << "Doing even more custom application logic." << std::endl;
    throw std::runtime_error("Standard error from deeper logic.");
}

// (KA) Handles app logic and gracefully deals with any exceptions that come up
void processBusinessLogic() {
    try {
        doEvenMoreCustomLogic();
    }
    catch (const std::exception& e) {
        ErrorLogger::logError(e.what());
    }
    std::cout << "Continuing with custom application logic." << std::endl;
}

// (KA) Quick test to make sure the error is actually caught — simple but effective
void runTests() {
    std::cout << "Running tests..." << std::endl;
    try {
        doEvenMoreCustomLogic();
    }
    catch (const std::exception& e) {
        std::cout << "Test passed: caught expected exception -> " << e.what() << std::endl;
    }
    std::cout << "Tests completed.\n" << std::endl;
}

// (KA) Main function kicks things off — runs the test first, then the app logic
int main() {
    runTests();
    processBusinessLogic();
    std::cout << "Main program finished successfully." << std::endl;
    return 0;
}
