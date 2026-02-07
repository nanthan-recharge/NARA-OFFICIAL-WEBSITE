import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

/**
 * Division Content Management
 */

// Get division content (custom override)
export const getDivisionContent = async (divisionId) => {
  try {
    const docRef = doc(db, 'divisions', divisionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching division content:', error);
    throw error;
  }
};

// Update or create division content
export const updateDivisionContent = async (divisionId, data) => {
  try {
    const docRef = doc(db, 'divisions', divisionId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error updating division content:', error);
    throw error;
  }
};

// Delete custom division content (revert to config)
export const deleteDivisionContent = async (divisionId) => {
  try {
    const docRef = doc(db, 'divisions', divisionId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting division content:', error);
    throw error;
  }
};

/**
 * Projects Management
 */

// Get all projects for a division
export const getProjects = async (divisionId) => {
  try {
    const q = query(
      collection(db, 'division_projects'),
      where('divisionId', '==', divisionId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const projects = [];

    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Get single project
export const getProject = async (projectId) => {
  try {
    const docRef = doc(db, 'division_projects', projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Add new project
export const addProject = async (projectData) => {
  try {
    const projectRef = doc(collection(db, 'division_projects'));
    await setDoc(projectRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, id: projectRef.id };
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Update project
export const updateProject = async (projectId, projectData) => {
  try {
    const docRef = doc(db, 'division_projects', projectId);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (projectId) => {
  try {
    const docRef = doc(db, 'division_projects', projectId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Team Members Management
 */

// Get all team members for a division
export const getTeamMembers = async (divisionId) => {
  try {
    const q = query(
      collection(db, 'division_team'),
      where('divisionId', '==', divisionId),
      orderBy('name.en', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const teamMembers = [];

    querySnapshot.forEach((doc) => {
      teamMembers.push({ id: doc.id, ...doc.data() });
    });

    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

// Get single team member
export const getTeamMember = async (memberId) => {
  try {
    const docRef = doc(db, 'division_team', memberId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching team member:', error);
    throw error;
  }
};

// Add new team member
export const addTeamMember = async (memberData) => {
  try {
    const memberRef = doc(collection(db, 'division_team'));
    await setDoc(memberRef, {
      ...memberData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, id: memberRef.id };
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

// Update team member
export const updateTeamMember = async (memberId, memberData) => {
  try {
    const docRef = doc(db, 'division_team', memberId);
    await updateDoc(docRef, {
      ...memberData,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

// Delete team member
export const deleteTeamMember = async (memberId) => {
  try {
    const docRef = doc(db, 'division_team', memberId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

/**
 * Image Upload Utilities
 */

// Upload image to Firebase Storage
export const uploadDivisionImage = async (file, divisionId, imageType = 'general') => {
  try {
    const timestamp = Date.now();
    const fileName = `${divisionId}/${imageType}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, `divisions/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      url: downloadURL,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload team member photo
export const uploadTeamMemberPhoto = async (file, divisionId, memberId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${divisionId}/team/${memberId}_${timestamp}.jpg`;
    const storageRef = ref(storage, `divisions/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      url: downloadURL,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading team member photo:', error);
    throw error;
  }
};

// Upload project image
export const uploadProjectImage = async (file, divisionId, projectId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${divisionId}/projects/${projectId}_${timestamp}.jpg`;
    const storageRef = ref(storage, `divisions/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      success: true,
      url: downloadURL,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading project image:', error);
    throw error;
  }
};

/**
 * Statistics and Analytics
 */

// Get division statistics
export const getDivisionStats = async (divisionId) => {
  try {
    const [projects, teamMembers] = await Promise.all([
      getProjects(divisionId),
      getTeamMembers(divisionId)
    ]);

    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      teamMemberCount: teamMembers.length
    };
  } catch (error) {
    console.error('Error fetching division stats:', error);
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      teamMemberCount: 0
    };
  }
};

/**
 * Search and Filter Utilities
 */

// Search projects across all divisions
export const searchProjects = async (searchQuery) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'division_projects'));
    const allProjects = [];

    querySnapshot.forEach((doc) => {
      allProjects.push({ id: doc.id, ...doc.data() });
    });

    // Filter by search query
    const query = searchQuery.toLowerCase();
    const filtered = allProjects.filter(project => {
      const titleEN = project.titleEN?.toLowerCase() || '';
      const titleSI = project.titleSI?.toLowerCase() || '';
      const titleTA = project.titleTA?.toLowerCase() || '';
      const descEN = project.descriptionEN?.toLowerCase() || '';

      return titleEN.includes(query) ||
             titleSI.includes(query) ||
             titleTA.includes(query) ||
             descEN.includes(query);
    });

    return filtered;
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
};

// Get all projects across all divisions (for global view)
export const getAllProjects = async () => {
  try {
    const q = query(
      collection(db, 'division_projects'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const projects = [];

    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
};

/**
 * Batch Operations
 */

// Initialize division with default content
export const initializeDivision = async (divisionId, configData) => {
  try {
    const docRef = doc(db, 'divisions', divisionId);
    await setDoc(docRef, {
      ...configData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublished: true
    });

    return { success: true };
  } catch (error) {
    console.error('Error initializing division:', error);
    throw error;
  }
};

// Bulk import team members
export const bulkImportTeamMembers = async (divisionId, teamMembersArray) => {
  try {
    const promises = teamMembersArray.map(member =>
      addTeamMember({ ...member, divisionId })
    );

    await Promise.all(promises);

    return { success: true, count: teamMembersArray.length };
  } catch (error) {
    console.error('Error bulk importing team members:', error);
    throw error;
  }
};

// Bulk import projects
export const bulkImportProjects = async (divisionId, projectsArray) => {
  try {
    const promises = projectsArray.map(project =>
      addProject({ ...project, divisionId })
    );

    await Promise.all(promises);

    return { success: true, count: projectsArray.length };
  } catch (error) {
    console.error('Error bulk importing projects:', error);
    throw error;
  }
};

export default {
  // Division Content
  getDivisionContent,
  updateDivisionContent,
  deleteDivisionContent,

  // Projects
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,

  // Team Members
  getTeamMembers,
  getTeamMember,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,

  // Images
  uploadDivisionImage,
  uploadTeamMemberPhoto,
  uploadProjectImage,

  // Stats & Search
  getDivisionStats,
  searchProjects,
  getAllProjects,

  // Batch Operations
  initializeDivision,
  bulkImportTeamMembers,
  bulkImportProjects
};
