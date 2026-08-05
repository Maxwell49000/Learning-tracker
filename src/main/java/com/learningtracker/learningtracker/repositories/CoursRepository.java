package com.learningtracker.learningtracker.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.learningtracker.learningtracker.models.Cours;

@Repository
public interface CoursRepository extends JpaRepository<Cours, Integer> {   


}
