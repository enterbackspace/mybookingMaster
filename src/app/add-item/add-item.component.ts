import { Component, Inject, Optional } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  type = [
    { value: 'veg', viewvalue: 'VEG' },
    { value: 'non-veg', viewvalue: 'Non-VEG' }
  ];
  actionBtn: string = 'Submit';
  quote: string = 'Add Vegetables';
  registerForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    public ss: ServiceService,
    public toastr: ToastrService,

    // 👇 Optional injections to support route-based usage
    @Optional() public dialogRef?: MatDialogRef<AddItemComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public edit?: any
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      productId: ['', [Validators.required, Validators.minLength(5)]],
      ProductName: ['', Validators.required],
      Quantity: ['', Validators.required],
      Ingerdiance: ['', Validators.required],
      type: ['', Validators.required],
      isactive: [true],
      imageUrl: ['', Validators.required],
      mrp: ['', Validators.required],
      price: ['', Validators.required],
      discount: ['', Validators.required]
    });

    if (this.edit) {
      this.actionBtn = 'Update';
      this.quote = 'Edit Product Details';
      this.registerForm.patchValue(this.edit);
    }
  }

  proceedRegistration() {
    if (!this.edit) {
      if (this.registerForm.valid) {
        this.http.post('http://localhost:3000/vegitable', this.registerForm.value).subscribe({
          next: (res) => {
            this.toastr.success('Product Added Successfully');
            this.registerForm.reset();
            console.log(res);
            if (this.dialogRef) {
              this.dialogRef.close('add');
            }
          },
          error: () => {
            this.toastr.error('Error while adding data');
          }
        });
      }
    } else {
      this.update();
    }
  }

  update() {
    this.ss.update(this.registerForm.value, this.edit.id).subscribe({
      next: (res) => {
        this.toastr.success('Details Updated Successfully');
        this.registerForm.reset();
        console.log(res);
        if (this.dialogRef) {
          this.dialogRef.close('update');
        }
      },
      error: () => {
        this.toastr.error('Error while updating details');
      }
    });
  }
}
