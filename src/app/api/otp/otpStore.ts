interface OTPRecord {
    otp: string;
    expiresAt: number;
    attempts: number;
  }
  
  class OTPStore {
    private store: Map<string, OTPRecord> = new Map();
    
    // Clean up expired OTPs periodically
    constructor() {
      // Run cleanup every minute
      setInterval(() => this.cleanup(), 60 * 1000);
    }
    
    // Save OTP with expiry time
    setOTP(phone: string, otp: string, expirySeconds = 300): void {
      this.store.set(phone, {
        otp,
        expiresAt: Date.now() + (expirySeconds * 1000),
        attempts: 0
      });
    }
    
    // Get OTP if not expired
    getOTP(phone: string): string | null {
      const record = this.store.get(phone);
      
      if (!record) {
        return null;
      }
      
      // Check if OTP has expired
      if (Date.now() > record.expiresAt) {
        this.store.delete(phone);
        return null;
      }
      
      return record.otp;
    }
    
    // Track verification attempts
    incrementAttempts(phone: string): number {
      const record = this.store.get(phone);
      if (!record) return 0;
      
      record.attempts += 1;
      this.store.set(phone, record);
      
      return record.attempts;
    }
    
    // Delete OTP
    deleteOTP(phone: string): void {
      this.store.delete(phone);
    }
    
    // Check if rate limit exceeded (max 3 OTPs in 10 minutes per phone)
    canSendOTP(phone: string, windowMinutes = 10, maxAttempts = 3): boolean {
      // Get all OTPs for this phone in the last windowMinutes
      const now = Date.now();
      const windowMs = windowMinutes * 60 * 1000;
      
      // Count how many OTPs were generated in the time window
      let recentAttempts = 0;
      
      // We'll use a separate tracking map for this
      const phoneKey = `rate:${phone}`;
      const rateRecord = this.store.get(phoneKey);
      
      if (rateRecord && now < rateRecord.expiresAt) {
        recentAttempts = rateRecord.attempts;
        
        if (recentAttempts >= maxAttempts) {
          return false;
        }
        
        // Increment the counter
        this.store.set(phoneKey, {
          ...rateRecord,
          attempts: recentAttempts + 1
        });
      } else {
        // First attempt in the window
        this.store.set(phoneKey, {
          otp: '',
          expiresAt: now + windowMs,
          attempts: 1
        });
      }
      
      return true;
    }
    
    // Clean up expired entries
    private cleanup(): void {
      const now = Date.now();
      for (const [key, record] of this.store.entries()) {
        if (now > record.expiresAt) {
          this.store.delete(key);
        }
      }
    }
  }
  
  // Create a singleton instance
  const otpStore = new OTPStore();
  export default otpStore;