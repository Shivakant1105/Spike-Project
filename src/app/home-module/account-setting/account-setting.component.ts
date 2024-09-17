import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {
  resetPasswordForm!: FormGroup
  token!: string
  constructor(private fb: FormBuilder, private commonService: CommonService, private route: Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.customValidator });

  
  }

/**
 * @description Handles password reset by validating the form, checking for mismatching passwords, and making a reset request.
 * @author Abhilasha Singh
 * @returns {void}
 */

  save(): void{
    Object.values(this.resetPasswordForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if(this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.valid);
      
    const { oldPassword, newPassword } = this.resetPasswordForm.value;    
    this.commonService.resetPassword(oldPassword, newPassword).subscribe((res:any)=>{
      console.log(res);
      
      alert("Password has been changed successfully");    
      this.route.navigate(['/auth/login']);       
    })          
    }
    else {
      console.log("form invalid");
      
    }
  }

/**
 * @description Custom validator that checks if the new password and confirm password fields match, and ensures the new password is not the same as the old password.
 * This validator returns errors for the following conditions:
 * - `sameAsOldPassword`: The new password cannot be the same as the old password.
 * - `passwordsMismatch`: The new password and confirm password must match.
 * @param {FormGroup} formGroup - The form group containing the password fields. 
 * @returns {{ [key: string]: any } | null} - Returns an object with validation errors if the conditions are not met, otherwise returns null.
 */

  customValidator(formGroup: FormGroup) : { [key: string]: any } | null{
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value; 
    const oldPassword = formGroup.get('oldPassword')?.value; 
    const errors: { [key: string]: any } = {};
    if (oldPassword === newPassword  &&  oldPassword) {      
      errors['sameAsOldPassword'] = true;
    }
    
    if (newPassword != confirmPassword && confirmPassword ) {           
      errors['passwordsMismatch'] = true;
    }   
    return Object.keys(errors).length > 0 ? errors : null;
  }
}
