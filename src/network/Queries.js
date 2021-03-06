import {fetchFactory, getFileDownloadURL, logger} from '../utils';
import {accountsStore, globalState, persistStore, userStore} from '../stores';
import fetch from "isomorphic-unfetch";

export async function loginQuery(username, password) {
    try {
        await fetchFactory('/user/login', {
            method: 'POST',
            body: {
                username: username,
                password: password,
                DeviceID: 'user ip',
                HasAuthenticated: persistStore.apiToken ? 1 : 0,
            },
        }).then(response => {
            console.info('***** loginQuery response: ', response);
            accountsStore.accounts = response.data;
            persistStore.apiToken = response.apiToken;
            persistStore.username = username;
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function setPushTokenQuery(pushToken) {
    try {
        await fetchFactory('/user/pushToken', {
            method: 'POST',
            body: {
                PushID: pushToken,
            },
        }).then(response => {

        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function roleQuery() {
    try {
        persistStore.roles = await fetchFactory('/user/role', {
            method: 'GET',
        });
    } catch (e) {
        console.warn('************ roleQuery E:', e);
        throw e;
    }
}

export async function getUserBalance() {

    try {
        return await fetchFactory(
            `/user/balance/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function searchUserQuery(mobile, name, unitNumber) {
    try {
        return await fetchFactory(
            `/user/search/${userStore.BuildingID}/${mobile}.${name}.${unitNumber}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function setLobbyPhotoQuery(lobbyPhotoName) {
    try {
        await fetchFactory('/apartment/lobby', {
            method: 'POST',
            body: {
                LobbyPhoto: lobbyPhotoName,
                BuildingID: userStore.BuildingID,
                UnitID: userStore.UnitID,
            },
        });
        return true;
    } catch (e) {
        throw e;
    }
}

export async function getLobbyQuery() {
    try {
        return await fetchFactory(
            `/apartment/lobby/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addUnitQuery(units) {
    let isMyUnit = false;
    try {
        await fetchFactory(
            `/unit/add/${isMyUnit}/${userStore.RoleID}.${userStore.BuildingID}.${
                userStore.UnitID
            }`,
            {
                method: 'POST',
                body: {UnitData: units},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addMyUnitQuery(units, features) {
    let isMyUnit = true;
    try {
        await fetchFactory(
            `/unit/add/${isMyUnit}/${userStore.RoleID}.${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: {UnitData: units, FeatureData: features},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function deleteUnitQuery(id) {
    let isMyUnit = false;
    try {
        await fetchFactory(
            `/unit/add/${isMyUnit}/${userStore.RoleID}.${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: {UnitData: {ID: id, IsDisabled: 1}},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addNoticeBoardQuery(notice) {
    try {
        await fetchFactory('/noticeBoard', {
            method: 'POST',
            body: notice,
        });
    } catch (e) {
        throw e;
    }
}

export async function getNoticeBoardQuery() {
    try {
        return await fetchFactory(
            `/noticeBoard/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAllUnits() {
    try {
        return await fetchFactory(
            `/unit/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );

    } catch (e) {
        throw e;
    }
}

export async function getMyUnitFeatures() {
    try {
        return await fetchFactory(
            `/unit/features`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getMyUnitFeatureDetails(featureId) {
    try {
        return await fetchFactory(
            `/unit/featureDetails/${featureId}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getUnitsById(id, isMyUnit) {
    try {
        return await fetchFactory(
            `/unit/info/${isMyUnit}/${userStore.BuildingID}.${id}/${userStore.RoleID}.${
                userStore.UnitID
            }`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getContactUsQuery() {
    try {
        return await fetchFactory(
            `/contactUs/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addContactUsQuery(contact) {
    try {
        await fetchFactory('/contactUs', {
            method: 'POST',
            body: contact,
        });
        return true;
    } catch (e) {
        throw e;
    }
}

export async function deleteContactUsQuery(contactID) {
    try {
        await fetchFactory(
            `/contactUs/${contactID}.${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'DELETE',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getPostMemberQuery() {
    try {
        // building.postMembers = [];
        return await fetchFactory('/contactUs/title/', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getMembersOfBuildingQuery() {
    try {
        return await fetchFactory(
            `/apartment/members/${userStore.BuildingID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getSuggestionQuery() {
    try {
        return await fetchFactory(
            `/suggestion/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addSuggestionQuery(suggestion) {
    try {
        await fetchFactory('/suggestion', {
            method: 'POST',
            body: suggestion,
        });
    } catch (e) {
        throw e;
    }
}

export async function getDocumentTypes() {
    try {
        return await fetchFactory('/apartment/documentTypes', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function addRuleQuery(rule) {
    try {
        await fetchFactory('/rule', {
            method: 'POST',
            body: rule,
        });
    } catch (e) {
        throw e;
    }
}

export async function getRuleQuery() {
    try {
        return await fetchFactory(
            `/rule/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCostQuery() {
    try {
        return await fetchFactory(
            `/cost/list/${userStore.BuildingID}.${userStore.UnitID}.${
                userStore.RoleID
            }`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function addCostQuery(cost) {
    try {
        await fetchFactory('/cost', {
            method: 'POST',
            body: cost,
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostEditQuery(id) {
    try {
        return await fetchFactory(
            `/cost/edit/${userStore.BuildingID}.${userStore.UnitID}.${id}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCostClassQuery() {
    try {
        return await fetchFactory('/cost/class', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostTypeQuery() {
    try {
        return await fetchFactory(`/cost/type/${userStore.BuildingID}`, {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function setCostTypeQuery(item) {
    try {
        await fetchFactory('/cost/type', {
            method: 'PUT',
            body: item,
        });
        return true;
    } catch (e) {
        throw e;
    }
}

export async function getCostOccupationQuery() {
    try {
        return await fetchFactory('/cost/occupation', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostCalculateQuery() {
    try {
        return await fetchFactory('/cost/calculate', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getCostSettingQuery() {
    try {
        return await fetchFactory(`/setting/${userStore.BuildingID}`, {
            method: 'GET',
        });

    } catch (e) {
        throw e;
    }
}

export async function getCostSettingDetailQuery(id) {
    try {
        return await fetchFactory(
            `/setting/calc/${userStore.BuildingID}.${id}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function submitAddCost(newCost) {
    try {
        return await fetchFactory('/cost/add', {
            method: 'POST',
            body: newCost,
        });
    } catch (e) {
        throw e;
    }
}
export async function removeCostQuery(costId) {

    let item={ID:costId,CallerRoleID:userStore.RoleID,CallerBuildingID:userStore.BuildingID}
    try {
        return await fetchFactory('/cost/delete', {
            method: 'POST',
            body: item,
        });
    } catch (e) {
        throw e;
    }
}

export async function setCostSettingQuery(settings) {
    try {
        await fetchFactory('/setting', {
            method: 'PUT',
            body: settings,
        });
    } catch (e) {
        throw e;
    }
}

export async function setCostSettingCalcQuery(calculate) {
    try {
        await fetchFactory('/setting/calc', {
            method: 'PUT',
            body: calculate,
        });
    } catch (e) {
        throw e;
    }
}

export async function getUnitBalance() {
    try {
        return await fetchFactory(
            `/acc/balance/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getTransaction(body) {
    try {
        return await fetchFactory(
            `/acc/transaction`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getPaymentType() {
    try {
        return await fetchFactory('/acc/payType', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getBankListQuery() {
    try {
        return await fetchFactory('/acc/bank', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getBuildingAccountQuery() {
    try {
        return await fetchFactory(
            `/acc/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function cudBuildingAccountQuery(account) {
    try {
        await fetchFactory('/acc', {
            method: 'POST',
            body: account,
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityTypeQuery() {
    try {
        return await fetchFactory('/facility/type', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityWeekDayQuery() {
    try {
        return await fetchFactory('/facility/weekDay', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityStatusQuery() {
    try {
        return await fetchFactory('/facility/statusList', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getFacilityScheduleStatusQuery() {
    try {
        return await fetchFactory('/facility/scheduleStatus', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}
export async function getWeekDayQuery() {
    try {
        return await fetchFactory(
            `/facility/weekDay`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getFacilityScheduleWithIdDayQuery(FacilityID, DayOfWeek) {
    try {
        return await fetchFactory(
            `/facility/${userStore.BuildingID}.${userStore.UnitID}/${
                userStore.RoleID
            }.${FacilityID}.${DayOfWeek}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function cudBuildingFacilityQuery(facility) {
    facility.BuildingID= userStore.BuildingID;
    facility.UnitID= userStore.UnitID;
    facility.RoleID= userStore.RoleID;
    try {
        await fetchFactory('/facility', {
            method: 'POST',
            body: facility,
        });
    } catch (e) {
        throw e;
    }
}

export async function cudFacilityScheduleQuery(schedule) {
    try {
        await fetchFactory('/facility/schedule', {
            method: 'POST',
            body: schedule,
        });
    } catch (e) {
        throw e;
    }
}

export async function getBuildingFacilityQuery(isDisabled = null) {
    try {
        return await fetchFactory(
            `/facility/${userStore.BuildingID}.${userStore.UnitID}.${
                userStore.RoleID
            }.${isDisabled}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function filterFacilityQuery(params) {
    params.CallerBuildingID= userStore.BuildingID;
    params.CallerUnitID= userStore.UnitID;
    params.CallerRoleID= userStore.RoleID;

    try {
        return await fetchFactory('/facility/filter', {
            method: 'POST',
            body: params,
        });
    } catch (e) {
        throw e;
    }
}
export async function cancelReserveQuery(reserve) {
    reserve.CallerBuildingID= userStore.BuildingID;
    reserve.CallerUnitID= userStore.UnitID;
    reserve.CallerRoleID= userStore.RoleID;
    try {
        return await fetchFactory('/facility/reserveWithoutPaymeny', {
            method: 'POST',
            body: reserve,
        });
    } catch (e) {
        throw e;
    }
}
export async function reserveWithoutPaymentQuery(reserve) {
    reserve.CallerBuildingID= userStore.BuildingID;
    reserve.CallerUnitID= userStore.UnitID;
    reserve.CallerRoleID= userStore.RoleID;
    try {
        return await fetchFactory('/facility/reserveWithoutPaymeny', {
            method: 'POST',
            body: reserve,
        });
    } catch (e) {
        throw e;
    }
}
export async function reserveByManuallyPaymentQuery(reserve) {
    reserve.CallerBuildingID= userStore.BuildingID;
    reserve.CallerUnitID= userStore.UnitID;
    reserve.CallerRoleID= userStore.RoleID;
    reserve.PurchaseTypeID=2;

    try {
        await fetchFactory('/facility/reserveByManuallyPayment', {
            method: 'POST',
            body: reserve,
        });
    } catch (e) {
        throw e;
    }
}

export async function getScadualReservesQuery(buildingFacilityScheduleID,reserveDate) {
    try {
        return await fetchFactory(
            `/facility/getReserved/${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${buildingFacilityScheduleID}.${reserveDate}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}




export async function getForPaymentQuery(formId, payUserId = null, payUnitId = null) {
    try {
        return await fetchFactory(
            `/pay/${userStore.BuildingID}/${formId}.${userStore.UnitID}.${payUserId}.${payUnitId}.${userStore.RoleID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getForPaymentDetailQuery(formId, announceId) {
    try {
        return await fetchFactory(
            `/pay/detail/${userStore.BuildingID}/${formId}.${userStore.UnitID}.${announceId}.${userStore.RoleID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function setPaymentQuery(paymentInfo) {
    try {
        return await fetchFactory('/pay', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}

export async function setTestPaymentQuery(paymentInfo) {
    try {
        return await fetchFactory('/pay/test', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}

export async function setConfirmPaymentQuery(paymentInfo) {
    try {
        return await fetchFactory('/pay/confirm', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}

export async function getDetailPaymentQuery(announceDetailID,viewUserID,viewUnitID) {
    try {
        return await fetchFactory(
            `/pay/paymentDetail/${userStore.BuildingID}/${userStore.UnitID}.${userStore.RoleID}.${announceDetailID}.${viewUserID}.${viewUnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getDetailCalculatePaymentQuery(periodDetailID,costClassID,viewUserID,viewUnitID) {
    try {
        return await fetchFactory(
            `/pay/calculationPaymentDetail/${userStore.BuildingID}/${userStore.UnitID}.${userStore.RoleID}.${periodDetailID}.${costClassID}.${viewUserID}.${viewUnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function updatePaymentQuery(paymentInfo) {
    try {
        return await fetchFactory('/pay', {
            method: 'PUT',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function deletePaymentQuery(paymentInfo) {
    paymentInfo.CallerBuildingID =userStore.BuildingID;
    paymentInfo.CallerRoleID =userStore.RoleID;
    paymentInfo.CallerUnitID =userStore.UnitID;
    try {
        return await fetchFactory('/pay/delete', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function setPaymentManuallyQuery(paymentInfo) {
    try {
        await fetchFactory('/pay/manually', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function updatePaymentManuallyQuery(paymentInfo) {
    try {
        await fetchFactory('/pay/manuallyUpdate', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}
export async function getPaymentDetail(paymentInfo) {
    try {
        return await fetchFactory('/pay/test', {
            method: 'POST',
            body: paymentInfo,
        });
    } catch (e) {
        throw e;
    }
}


export async function getYearQuery() {
    try {
        return await fetchFactory(
            `/setting/year/${userStore.BuildingID}.${userStore.UnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function setFiscalYearQuery(year) {
    try {
        await fetchFactory('/setting/fiscalYear', {
            method: 'PUT',
            body: year,
        });
    } catch (e) {
        throw e;
    }
}

export async function getPeriodQuery(year, period = null) {
    try {
        return await fetchFactory(
            `/setting/period/${userStore.BuildingID}.${userStore.UnitID}.${year}.${period}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function setPeriodQuery(body) {
    try {
        await fetchFactory('/setting/period/', {
            method: 'POST',
            body: body,
        });
    } catch (e) {
        throw e;
    }
}

export async function setDefaultCharge(body) {
    try {
        return await fetchFactory('/setting/defaultCharge/', {
            method: 'POST',
            body: body,
        });
    } catch (e) {
        throw e;
    }
}

export async function getProcessCalc(dataCalc) {
    try {
        return await fetchFactory('/cost/addResult', {
            method: 'POST',
            body: dataCalc,
        });
    } catch (e) {
        console.warn('!!!!!!!!!!! getProcessCalc e: ', e);
        throw e;
    }
}

export async function getSurveyQuery() {
    try {
        return await fetchFactory(
            `/survey/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function submitSurveyResultQuery(result) {
    try {
        await fetchFactory('/survey/opinion', {
            method: 'POST',
            body: result,
        });
    } catch (e) {
        throw e;
    }
}

export async function submitSurveyQuery(survey) {
    try {
        await fetchFactory('/survey', {
            method: 'POST',
            body: survey,
        });
    } catch (e) {
        throw e;
    }
}

export async function changeUserPhotoQuery(body) {
    try {
        await fetchFactory(
            `/user/changePhoto/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function changeUserPassword(body) {
    try {
        await fetchFactory(
            `/user/changePassword/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function changeUserProfile(body) {
    try {
        await fetchFactory(
            `/user/changeProfile/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAnnouncements() {
    try {
        return await fetchFactory(
            `/announce/${userStore.BuildingID}.${userStore.UnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getFirstUserBalance() {
    try {
        return await fetchFactory(
            `/user/firstUserBalance/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getFirstUserBalanceNew(pageSize=10,pageIndex=0) {
    try {
        return await fetchFactory(
            `/user/firstUserBalanceNew/${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function setFirstUserBalance(body) {
    try {

        await fetchFactory(
            `/user/firstUserBalance/${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAnnouncementWithId(id) {
    try {
        return await fetchFactory(
            `/announce/${id}/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getForAnnouncementsDefaultCharge(periodDetailId, formId) {
    try {
        return await fetchFactory(
            `/announce/forAnnouncement/defaultCharge/${periodDetailId}.${formId}.${userStore.BuildingID}.${userStore.UnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function getForAnnouncementsCalculationHeader(costClassId, periodDetailId = null, calculationHeaderId = null) {
    try {
        const arrayId = calculationHeaderId ? '[' + calculationHeaderId + ']' : calculationHeaderId;
        return await fetchFactory(
            `/announce/forAnnouncement/calculationHeader/${costClassId}/${periodDetailId}.${arrayId}.${userStore.BuildingID}.${userStore.UnitID}`,
            {method: 'GET'},
        );
    } catch (e) {
        throw e;
    }
}

export async function addAnnouncements(announcements) {
    try {
        await fetchFactory(
            `/announce/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: announcements,
            },
        );
    } catch (e) {
        throw e;
    }
}


export async function deleteAnnouncementQuery( announcement) {
    announcement.CallerBuildingID =userStore.BuildingID;
    announcement.CallerRoleID =userStore.RoleID;
    announcement.CallerUnitID =userStore.UnitID;
    try {
        await fetchFactory(
            `/announce/delete`,
            {
                method: 'POST',
                body: announcement,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getAllNotification() {
    try {
        return await fetchFactory('/notification/getAll', {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function searchUserByMobile(mobileNumber) {
    try {
        return await fetchFactory(
            `/user/searchByMobile/${mobileNumber}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function createUser(body) {
    try {
        await fetchFactory(
            `/user/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: body,
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function setResidentForUnit(body) {
    try {
        await fetchFactory(
            `/unit/resident/${userStore.BuildingID}.${userStore.UnitID}`,
            {
                method: 'POST',
                body: {Data: body, RoleID: userStore.RoleID},
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getResidentForUnit(unitId) {
    try {
        return await fetchFactory(
            `/unit/resident/${unitId}/${userStore.RoleID}.${userStore.BuildingID}.${
                userStore.UnitID
            }`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function cudUnitPhotoQuery(pictures) {
    try {
        return await fetchFactory('/unit/photo', {
            method: 'POST',
            body: pictures,
        });
    } catch (e) {
        throw e;
    }
}


export async function addCarQuery(car) {
    try {
        await fetchFactory('/car', {
            method: 'POST',
            body: car,
        });
    } catch (e) {
        throw e;
    }
}


export async function getUnitCarQuery(UnitID,allCar=null) {
    try {
        return await fetchFactory(
            `/car/${userStore.BuildingID}.${UnitID}.${userStore.RoleID}.${userStore.UnitID}.${allCar}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarColorQuery() {
    try {
        return await fetchFactory(
            `/car/colorList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarTagCharacterQuery() {
    try {
        return await fetchFactory(
            `/car/tagCharacterList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarBrandQuery() {
    try {
        return await fetchFactory(
            `/car/brandList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCarModelQuery(BrandID) {
    try {
        return await fetchFactory(
            `/car/modelList/${BrandID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}
export async function getSupplierkListQuery() {
    try {
        return await fetchFactory(`/apartment/suppliers/${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}`, {
            method: 'GET',
        });
    } catch (e) {
        throw e;
    }
}

export async function getRentQuery(CostTypeID) {
    try {
        return await fetchFactory(
            `/rent/${userStore.BuildingID}.${userStore.UnitID}.${userStore.RoleID}.${CostTypeID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function defineRentQuery(rent) {
    rent.CallerBuildingID= userStore.BuildingID;
    rent.CallerUnitID= userStore.UnitID;
    rent.CallerRoleID= userStore.RoleID;
    try {
        await fetchFactory('/rent/defineRent', {
            method: 'POST',
            body: rent,
        });
    } catch (e) {
        throw e;
    }
}
export async function doRentingQuery(rent) {
    rent.CallerBuildingID= userStore.BuildingID;
    rent.CallerUnitID= userStore.UnitID;
    rent.CallerRoleID= userStore.RoleID;
    try {
        await fetchFactory('/rent', {
            method: 'POST',
            body: rent,
        });
    } catch (e) {
        throw e;
    }
}
export async function setEmptyQuery(rent) {
    rent.CallerBuildingID= userStore.BuildingID;
    rent.CallerUnitID= userStore.UnitID;
    rent.CallerRoleID= userStore.RoleID;
    try {
        await fetchFactory('/rent/setEmpty', {
            method: 'POST',
            body: rent,
        });
    } catch (e) {
        throw e;
    }
}

export async function getPaymentMethodsQuery() {
    try {
        return await fetchFactory(
            `/rent/paymentMethodList`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getCostTypeListQuery(costClassID) {
    try {
        return await fetchFactory(
            `/pay/costTypeList/${userStore.BuildingID}.${costClassID}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}

export async function getBiuldingOrUserBankAccount(userId) {
    try {
        return await fetchFactory(
            `/user/biuldingOrUserBankAccount/${userStore.BuildingID}.${userId}`,
            {
                method: 'GET',
            },
        );
    } catch (e) {
        throw e;
    }
}



/**************************file query*******************/
function unicodeToChar(text) {
    if (text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    } else return 'مشکلی پیش آمده! با پشتیبانی تماس بگیرید.';
}
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => binary += String.fromCharCode(b));

    return window.btoa(binary);
};
export async function getImageBase64Query(fileName) {
    const headersSetting={
        'Access-Control-Allow-Origin': '*',
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
        'Authorization' : 'Bearer ' + persistStore.apiToken,
    }

    let requestURL=getFileDownloadURL(fileName)
    try {
        const response = await fetch(requestURL, {
            headers: headersSetting,
            method: 'GET'
        });

        const message = unicodeToChar(response.headers.get('errMessage'));

        logger('%%%%%%%%%%%%%%%% fetchFactory response.url : ', response.url);
        logger('%%%%%%%%%%%%%%%% fetchFactory response.message : ', message);

        if (response.status === 200) {
            if (parseInt(response.headers.get('errCode')) === 1000) {
                globalState.toastType = 'success';
                globalState.setResponseCode(1000);
                globalState.setResponseMessage('');
            } else {
                globalState.toastType = 'success';
                globalState.setResponseCode(parseInt(response.headers.get('errCode')));
                globalState.setResponseMessage(message);
            }

            let imageStr
            await response.arrayBuffer().then((buffer) => {
                imageStr = arrayBufferToBase64(buffer);
            });
            return await 'data:image/jpeg;base64,'+imageStr;
        } else if (response.status === 507) {
            alert(message, Toast.LONG);
        } else if (response.ok && response.status !== 200) {
            logger('%%%%%%%%%%%%%%%% fetchFactory errMessage: ', message);
            if (message !== 'لیست خالی') {
                const errCode = parseInt(response.headers.get('errCode'));
                globalState.setResponseCode(errCode);
                globalState.setResponseMessage(message);
                globalState.toastType = errCode === -1 ? 'error' : 'warning';
            }

            // noinspection ExceptionCaughtLocallyJS
            throw {errCode: parseInt(response.headers.get('errCode')), errMessage: message};
        } else {
            logger('%%%%%%%%%%%%%%%% fetchFactory throw new Error() url:', response.url);
            const errMessage = '!!! Error ' + response.status + ' !!!';
            globalState.setResponseCode(response.status);
            globalState.setResponseMessage(errMessage);
            globalState.toastType = 'error';
            globalState.showToastCard();
            throw {errCode: 0, errMessage: errMessage};
        }



    } catch (e) {
        throw e;
    }
}




