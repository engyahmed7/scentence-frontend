import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileInformationService } from '../../Services/profile-information.service';
import * as jwtDecode from 'jwt-decode';
import { MessageSuccessComponent } from '../../message-success/message-success.component';

@Component({
	selector: 'app-profile-information-info',
	standalone: true,
	imports: [ReactiveFormsModule, HttpClientModule, MessageSuccessComponent],
	providers: [ProfileInformationService],
	templateUrl: './profile-information-info.component.html',
	styleUrl: './profile-information-info.component.css',
})
export class ProfileInformationInfoComponent implements OnInit {
	constructor(
		private router: Router,
		private profileInfoService: ProfileInformationService,
	) {}

	userInfo!: any;
	imageUrl!: string;
	message = {
		status: '',
		text: '',
	};
	ngOnInit(): void {
		this.profileInfoService.getProfileInformation().subscribe({
			next: (data) => {
				this.userInfo = data;
				this.userInfo = this.userInfo.User;
				this.imageUrl = this.userInfo.image;
				const fullName = this.userInfo?.fullName ? this.userInfo.fullName : '';
				const username = this.userInfo?.username ? this.userInfo.username : '';
				let birthDate = this.userInfo?.birthDate ? this.userInfo.birthDate : '';
				birthDate = new Date(birthDate).toISOString().split('T')[0];

				this.checkForm.controls.fullName.setValue(fullName);
				this.checkForm.controls.username.setValue(username);
				this.checkForm.controls.birthDate.setValue(birthDate);
			},
		});
	}
	checkForm = new FormGroup(
		{
			fullName: new FormControl('', [Validators.minLength(3)]),
			username: new FormControl('', [Validators.minLength(3)]),
			birthDate: new FormControl(''),
			photo: new FormControl(''),
		},
		{ updateOn: 'change' },
	);

	checkData(e: Event) {
		e.preventDefault();
		if (this.checkForm.valid) {
			// const { fullName, username, birthDate, photo } = this.checkForm.value;
			let photo: any = document.querySelector('[data-photo]');
			photo = photo['files'][0];
			const checkFormData: any = this.checkForm.value;
			const formData = new FormData();

			Object.keys(checkFormData).forEach((key) => {
				formData.append(key, checkFormData[key]);
			});
			if (photo) {
				formData.append('image', photo);
			}
			const messageElement = document.querySelector('[data-message]');
			messageElement?.classList.remove('translate-x-[1500px]');
			this.profileInfoService.updateProfileInformation(formData).subscribe({
				next: (data: any) => {
					console.log(data);
					this.message.status = 'success';
					this.message.text = 'User Updated Successfully';
				},
				error: (err) => {
					console.log(err);
					this.message.status = 'fail';
					this.message.text = 'error in updating user informatino';
				},
				complete: () => {
					setTimeout(() => {
						messageElement?.classList.add('translate-x-[1500px]');
					}, 2000);
				},
			});
		}
	}

	get fullNameChanged(): boolean {
		const fullName = this.checkForm.controls.fullName;
		return fullName.dirty && fullName.touched;
	}

	get usernameChanged(): boolean {
		const username = this.checkForm.controls.username;
		return username.dirty && username.touched;
	}

	get fullNameValid(): boolean {
		return this.checkForm.controls.fullName.valid;
	}
	get usernameValid(): boolean {
		return this.checkForm.controls.username.valid;
	}

	selectFile(e: any) {
		const photo = e.target.files[0];
		if (photo) {
			this.previewImage(photo);
		}
	}
	previewImage(file: File) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			this.imageUrl = reader.result as string; // Cast result to string
			console.log(this.imageUrl);
		};
	}
}
