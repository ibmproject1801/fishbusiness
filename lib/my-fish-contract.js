/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

class MyContract extends Contract {


    async instantiate(ctx) {
        console.info('Instantiate empty lists');

        let emptyList = [];
        await ctx.stub.putState('fish', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('exportcompany', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('customcfficer', Buffer.from(JSON.stringify(emptyList)));

    }

    async AddFish(ctx, fishId, productcode, productdesc, quantity, value, shipmentdate, flightno, airwaybillno, consigneenameandaddress, consignornameandaddress, agrifoodandveterinary, certificateno, disease, certifyingofficial, state, status, remark1, remark2, remark3) {
        let cid = new ClientIdentity(ctx.stub);
        console.info(`Received "AddFish" transaction from ${cid.getID()}`);

        let fishlist = {
            participantId: cid.getID(),
            fishId: fishId,
            productcode: productcode,
            productdesc: productdesc,
            quantity: quantity,
            value: value,
            shipmentdate: shipmentdate,
            flightno: flightno,
            airwaybillno: airwaybillno,
            consigneenameandaddress: consigneenameandaddress,
            consignornameandaddress: consignornameandaddress,
            agrifoodandveterinary: agrifoodandveterinary,
            certificateno: certificateno,
            disease: disease,
            certifyingofficial: certifyingofficial,
            state: state,
            status: status,
            remark1: remark1,
            remark2: remark2,
            remark3: remark3,	
            type: 'fishlist',
        };

        //add fishId to 'fishlist' key
        const data = await ctx.stub.getState('fish');
        let fish = JSON.parse(data);

        // detects duplicate IDs
        if (fish.indexOf(fishId) === -1) {
            fish.push(fishId);
            await ctx.stub.putState('fish', Buffer.from(JSON.stringify(fish)));
        } else {
            throw new Error('Fish network with this id exists');
        }

        await ctx.stub.putState(fishId, Buffer.from(JSON.stringify(fishlist)));
        return JSON.stringify(fishlist);
    }

    async AcceptFish(ctx, fishId) {
        const exists = await this.FishExists(ctx, fishId);

        const data = await ctx.stub.getState(fishId);
        let jsonData;

        if (!exists) {
            throw new Error(`The fish id ${fishId} does not exist`);
        } else {
            jsonData = JSON.parse(data.toString());
            jsonData.status = 'unlock';
            jsonData.state = 'accept';
        }

        // const fishlist = {
        //     jsonData([)fishId]: jsonData.fishId,
        //     state: 'accept',
        //     status: 'unlock'};

        const buffer = Buffer.from(JSON.stringify(jsonData));
        await ctx.stub.putState(fishId, buffer);
        return JSON.stringify(jsonData);
    }

    async RejectFish(ctx, fishId, remark1) {
            const exists = await this.FishExists(ctx, fishId);
    
            const data = await ctx.stub.getState(fishId);
            let jsonData;
    
            if (!exists) {
                throw new Error(`The fish id ${fishId} does not exist`);
            } else {
                jsonData = JSON.parse(data.toString());
                jsonData.status = 'locked';
                jsonData.state = 'reject';
                jsonData.remark1 = remark1;
            }
    
            // const fishlist = {
            //     jsonData([)fishId]: jsonData.fishId,
            //     state: 'accept',
            //     status: 'unlock'};
    
            const buffer = Buffer.from(JSON.stringify(jsonData));
            await ctx.stub.putState(fishId, buffer);
            return JSON.stringify(jsonData);
        }


    async FishExists(ctx, fishId) {
        const buffer = await ctx.stub.getState(fishId);
        return (!!buffer && buffer.length > 0);
    }

    // get the state from key
    async TrackFish(ctx, fishId) {

        const data = await ctx.stub.getState(fishId);
        let jsonData;
        if (!data) {
            jsonData = { error: `no value with key ${fishId} exists` };
        } else {
            jsonData = JSON.parse(data.toString());
        }
        return JSON.stringify(jsonData);
    }

    async AddExportCompany(ctx, exportCompanyId, name) {
        let cid = new ClientIdentity(ctx.stub);
        console.info(`Received "AddExportCompany" transaction from ${cid.getID()}`);
        
        let exportCompany = {
            participantId: cid.getID(),
            exportCompanyId: exportCompanyId,
            name: name,
            type: 'exportcompany'
        };

        //add exportCompanyId to 'exportCompanys' key
        const data = await ctx.stub.getState('exportcompany');
        let exportCompanys = JSON.parse(data);

        // detects duplicate IDs
        if (exportCompanys.indexOf(exportCompanyId) === -1) {
            exportCompanys.push(exportCompanyId);
            await ctx.stub.putState('exportcompany', Buffer.from(JSON.stringify(exportCompanys)));
        } else {
            throw new Error('Export Company with this id exists');
        }

        // add utility company object
        await ctx.stub.putState(exportCompanyId, Buffer.from(JSON.stringify(exportCompany)));
        return JSON.stringify(exportCompany);
    }
}

module.exports = MyContract;
