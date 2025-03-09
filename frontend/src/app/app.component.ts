import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  people: any[] = [];
  formData: any = { name: '', age: '', gender: '', mobile: '' };
  editingPerson: any = null;
  apiUrl = 'http://localhost:8000/users';

  constructor(private ngZone: NgZone) {} 

  async fetchPeople() {
    try {
      const res = await axios.get(this.apiUrl);
      this.ngZone.run(() => {
        this.people = res.data;
      });
    } catch (err) {
      console.error('Error fetching people:', err);
      alert('Failed to fetch people. Check your API.');
    }
  }

  async addPerson(form: any) {
    if (!form.valid) return;
    const { _id, name, age, gender, mobile } = this.formData; 

    try {
      if (this.editingPerson) {
        console.log('🛠 Updating person:', this.formData); 

        await axios.put(`${this.apiUrl}/${_id}`, {
          name,
          age,
          gender,
          mobile,
        });

        this.editingPerson = null; 
      } else {
        await axios.post(this.apiUrl, { name, age, gender, mobile });
      }

      this.resetForm();
      this.fetchPeople(); 
    } catch (err) {
      console.error('Error saving person:', err);
      alert('Failed to save person. Check your API.');
    }
  }

  editPerson(person: any) {
    console.log(" Editing Person: ", person); 
    this.editingPerson = person;
    this.formData = { ...person }; 
  }

  async deletePerson(id: string) {
    if (!confirm('Are you sure you want to delete this person?')) return;

    try {
      await axios.delete(`${this.apiUrl}/${id}`);
      this.fetchPeople();
    } catch (err) {
      console.error('Error deleting person:', err);
      alert('Failed to delete person. Check your API.');
    }
  }

  resetForm() {
    this.formData = { name: '', age: '', gender: '', mobile: '' }; 
  }

  ngOnInit() {
    this.fetchPeople();
  }
}
