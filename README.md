# AMRIT - Health and Wellness Centre (HWC) 
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)  ![branch parameter](https://github.com/PSMRI/HWC-UI/actions/workflows/sast-and-package.yml/badge.svg)

Health and Wellness Centre (HWC) is one of the comprehensive applications of AMRIT designed to capture details of 7 Service packages as per guidelines which should be available at Health and Wellness centre.

### Primary Features
* Provide medical advice and services to beneficiaries
* Out patient service 
* Video consultation with specialists doctors
* Drug dispense and laboratory facility available at centre
* More than 20 lab tests can be performed using IOT devices and data flows directly to AMRIT
* Compliance with all 3 milestones of ABDM 
* SnomedCT, LOINC, ICD -10, FHIR compatible

### Patient Visit Category
* Ante natal care (ANC)
* Post natal care (PNC)
* Neonatal and infant health care services
* Childhood and adolescent health care services including immunisation
* Family planning, contraceptive services and other reproductive health care
* Care for acute simple illnesses and minor ailments 
* Management of communicable diseases
* National health programs (General OPD)
* Prevention, screening and management of non communicable diseases (NCD)

## Building From Source
This microservice is built on Java, Spring boot framework and MySQL DB.

### Prerequisites 
* HWC-API module should be running
* JDK 1.8
* Maven 
* Nodejs


## Installation
This service has been tested on Wildfly as the application server.

To install the Health and Wellness Centre (HWC) module, follow these steps:

Clone the repository to your local machine.
Install the dependencies.

* npm install
* npm install ng2-smart-table@1.2.1
* npm run build
* mvn clean install


## Configuration
The admin module can be configured by editing the config.js file. This file contains all of the settings for the module, such as the database connection string, the user authentication mechanism, and the role hierarchy.

### Prerequisites 
* Wildfly (or any compatible app server)
* Redis
* MySQL Database

## Integrations
* Video Consultation

## Usage
All features have been exposed as REST endpoints. Refer to the SWAGGER API specification for details.



<!-- # MMUUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0-rc.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md). -->
